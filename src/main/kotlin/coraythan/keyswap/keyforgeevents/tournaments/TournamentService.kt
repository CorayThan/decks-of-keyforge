package coraythan.keyswap.keyforgeevents.tournaments

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.keyforgeevents.KeyForgeEventDto
import coraythan.keyswap.keyforgeevents.KeyForgeEventFilters
import coraythan.keyswap.keyforgeevents.KeyForgeEventRepo
import coraythan.keyswap.keyforgeevents.KeyForgeEventService
import coraythan.keyswap.keyforgeevents.tournamentdecks.*
import coraythan.keyswap.keyforgeevents.tournamentparticipants.ParticipantStats
import coraythan.keyswap.keyforgeevents.tournamentparticipants.TournamentParticipant
import coraythan.keyswap.keyforgeevents.tournamentparticipants.TournamentParticipantRepo
import coraythan.keyswap.keyforgeevents.tournamentparticipants.participantStatsComparator
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.persistence.EntityManager
import kotlin.math.absoluteValue
import kotlin.random.Random
import kotlin.system.measureTimeMillis

@Transactional
@Service
class TournamentService(
        private val currentUserService: CurrentUserService,
        private val tournamentDeckRepo: TournamentDeckRepo,
        private val tournamentPairingRepo: TournamentPairingRepo,
        private val tournamentParticipantRepo: TournamentParticipantRepo,
        private val tournamentRoundRepo: TournamentRoundRepo,
        private val tourneyRepo: TournamentRepo,
        private val tournamentOrganizerRepo: TournamentOrganizerRepo,
        private val eventRepo: KeyForgeEventRepo,
        private val keyUserRepo: KeyUserRepo,
        private val deckRepo: DeckRepo,
        private val keyForgeEventService: KeyForgeEventService,
        private val entityManager: EntityManager,
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val query = JPAQueryFactory(entityManager)

    fun searchTournaments(filters: KeyForgeEventFilters): List<TournamentSearchResult> {

        val tournamentQ = QTournament.tournament
        val predicate = BooleanBuilder()

        if (filters.mineOnly) {
            val currentUser = currentUserService.loggedInUserOrUnauthorized()

            predicate.andAnyOf(
                    tournamentQ.organizers.any().organizer.id.eq(currentUser.id),
                    tournamentQ.participants.any().userId.eq(currentUser.id),
            )
        }

        val tournaments = query.selectFrom(tournamentQ)
                .where(predicate)
                .fetch()

        return tournaments
                .map { tournament ->
                    val event = eventRepo.findByTourneyId(tournament.id)?.toDto()
                            ?: throw BadRequestException("No event for tournament with id ${tournament.id}")
                    TournamentSearchResult(
                            id = tournament.id,
                            name = tournament.name,
                            private = tournament.privateTourney,
                            ended = tournament.ended,
                            event = event,
                            participants = tournamentParticipantRepo.countByTournamentId(tournament.id).toInt(),
                            organizerUsernames = tournament.organizers.map { it.organizer.username },
                            stage = tournament.stage,
                    )
                }
                .sortedBy { it.event.startDateTime }
    }

    fun findTourneyInfo(id: Long): TournamentInfo {
        val user = currentUserService.loggedInUser()
        val tourney = tourneyRepo.findByIdOrNull(id) ?: throw BadRequestException("No tournament for id $id")
        val event = eventRepo.findByTourneyId(id)!!

        val participants = tournamentParticipantRepo.findAllByTournamentId(id)
        val pairings = tournamentPairingRepo.findAllByTournamentId(id)
        val participantNames = participants
                .map { it.id to keyUserRepo.findByIdOrNull(it.userId) }
                .toMap()
        val participantStats = calculateParticipantStats(participants, pairings)
                .map { it.participant.id to it }
                .toMap()

        val allDecks = tournamentDeckRepo.findByTourneyId(id)

        val tournamentDeckInfos = allDecks.map {
            TournamentDeckInfo(
                    id = it.deck.id,
                    keyforgeId = it.deck.keyforgeId,
                    name = it.deck.name,
                    sas = it.deck.sasRating,
                    houses = it.deck.houses,
                    username = participantNames[it.participantId]!!.username,
                    hasVerificationImage = it.deck.hasOwnershipVerification == true,
                    tournamentDeckId = it.id,
            )
        }
                .sortedBy { it.username }

        val participantToDeckId: Map<String, List<String>> = tournamentDeckInfos
                .groupBy { it.username }
                .map { it.key to it.value.map { deck -> deck.keyforgeId } }
                .toMap()

        val tournamentDecksByUserName = tournamentDeckInfos.groupBy { it.username }

        val currentRound = tourney.rounds.maxByOrNull { it.roundNumber }
        val currentRoundStart = currentRound?.startedOn
        val timeExtendedMinutes = currentRound?.timeExtendedMinutes ?: 0
        val roundEnd = if (event.minutesPerRound != null) currentRoundStart?.plusMinutes(event.minutesPerRound.toLong() + (timeExtendedMinutes)) else null

        return TournamentInfo(
                tourneyId = id,
                name = tourney.name,
                privateTournament = tourney.privateTourney,
                organizerUsernames = tourney.organizers.map { it.organizer.username },
                joined = user?.username != null && participantNames.values.any { it?.username == user.username },
                stage = tourney.stage,
                registrationClosed = tourney.registrationClosed,
                deckChoicesLocked = tourney.deckChoicesLocked,
                verifyParticipants = tourney.verifyParticipants,
                pairingStrategy = tourney.pairingStrategy,
                roundEndsAt = roundEnd,
                timeExtendedMinutes = timeExtendedMinutes,
                event = event.toDto(),
                rounds = tourney.rounds.map { round ->
                    TournamentRoundInfo(
                            roundNumber = round.roundNumber,
                            roundId = round.id,
                            pairingStrategy = round.pairedWithStrategy,
                            pairings = tournamentPairingRepo.findAllByRoundId(round.id)
                                    .map {
                                        val firstUsername = participantNames[it.playerOneId]!!.username
                                        val secondUsername = participantNames[it.playerTwoId]?.username
                                        TournamentPairingInfo(
                                                table = it.pairingTable,
                                                pairId = it.id,
                                                playerOneId = it.playerOneId,
                                                playerOneUsername = firstUsername,
                                                playerOneWins = it.playerOneWins,
                                                playerTwoId = it.playerTwoId,
                                                playerTwoUsername = secondUsername,
                                                playerTwoWins = if (it.playerTwoId == null) null else it.playerTwoWins,
                                                playerOneScore = it.playerOneScore,
                                                playerTwoScore = it.playerTwoScore,
                                                playerOneWon = it.playerOneWon,
                                                tcoLink = it.tcoLink,
                                                deckIds = participantToDeckId[firstUsername]
                                                        ?.let { deckIds ->
                                                            if (secondUsername != null) {
                                                                deckIds.plus(participantToDeckId[secondUsername] ?: listOf())
                                                            } else {
                                                                deckIds
                                                            }
                                                        }
                                                        ?: listOf()
                                        )
                                    }
                                    .sortedBy {
                                        it.table
                                    }
                                    .reversed()
                    )
                }.sortedBy { it.roundNumber },
                rankings = participants
                        .mapNotNull {
                            val stats = participantStats[it.id]
                            if (stats == null) {
                                null
                            } else {
                                val rankingUser = participantNames[it.id]
                                val decks = tournamentDecksByUserName[rankingUser?.username] ?: listOf()
                                TournamentRanking(
                                        ranking = 1,
                                        username = rankingUser?.username ?: "No User",
                                        participantId = it.id,
                                        wins = stats.wins,
                                        losses = stats.losses,
                                        byes = stats.byes,
                                        strengthOfSchedule = stats.strengthOfSchedule,
                                        extendedStrengthOfSchedule = stats.extendedStrengthOfSchedule,
                                        score = stats.score,
                                        opponentsScore = stats.opponentsScore,
                                        dropped = it.dropped,
                                        verified = it.verified,
                                        decks = decks,
                                        discord = rankingUser?.discord,
                                        tcoUsername = rankingUser?.tcoUsername,
                                )
                            }
                        }
                        .sortedBy { it.fullRankValue() - (if (it.dropped) 1000000 else 0) }
                        .reversed()
                        .mapIndexed { index, tournamentRanking -> tournamentRanking.copy(ranking = index + 1) },
                tournamentDecks = tournamentDeckInfos
        )
    }

    fun createTourneyForEvent(eventId: Long, privateTourney: Boolean): Long {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val event = eventRepo.findByIdOrNull(eventId) ?: throw BadRequestException("No keyforge event with id $eventId")
        if (event.createdBy.id != user.id) {
            throw UnauthorizedException("Must be tournament organizer to perform admin functions.")
        }

        val savedTourney = tourneyRepo.save(Tournament(event.name, privateTourney))

        tournamentRoundRepo.save(TournamentRound(
                tourney = savedTourney,
                roundNumber = 1,
                pairedWithStrategy = savedTourney.pairingStrategy,
        ))

        tournamentOrganizerRepo.save(TournamentOrganizer(
                tourney = savedTourney,
                organizer = user
        ))

        eventRepo.save(event.copy(tourneyId = savedTourney.id))

        return savedTourney.id
    }

    fun createTourneyWithPrivateEvent(event: KeyForgeEventDto) {
        val savedEvent = keyForgeEventService.saveEvent(event)
        createTourneyForEvent(savedEvent.id, true)
    }

    fun deleteTournament(id: Long) {
        currentUserService.adminOrUnauthorized()

        if (!tourneyRepo.existsById(id)) throw BadRequestException("No tourney with id $id")

        tournamentPairingRepo.deleteAllByTournamentId(id)
        tournamentDeckRepo.deleteAllByTourneyId(id)
        tournamentRoundRepo.deleteAllByTourneyId(id)
        tournamentParticipantRepo.deleteAllByTournamentId(id)
        tournamentOrganizerRepo.deleteAllByTourneyId(id)
        eventRepo.deleteByTourneyId(id)
        tourneyRepo.deleteById(id)
    }

    fun pairNextRound(tourneyId: Long, manualPairings: List<TournamentPairingPlayers>? = null) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val lastRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to pair.")

        val roundToPair = if (tourney.stage == TournamentStage.PAIRING_IN_PROGRESS || tourney.stage == TournamentStage.TOURNAMENT_NOT_STARTED) {
            tournamentPairingRepo.deleteAllByRoundId(lastRound.id)
            lastRound
        } else {

            val nextRoundNumber = lastRound.roundNumber + 1

            tournamentRoundRepo.save(lastRound.copy(active = false))

            tournamentRoundRepo.save(
                    TournamentRound(
                            tourney = tourney,
                            roundNumber = nextRoundNumber,
                            pairedWithStrategy = tourney.pairingStrategy,
                    )
            )
        }

        val allParticipants = tournamentParticipantRepo.findAllByTournamentId(tourney.id)
        val activeCount = allParticipants.count { !it.dropped }

        if (activeCount < 2) {
            throw BadRequestException("Can't pair round with fewer than 2 players.")
        }

        val pastPairings = tournamentPairingRepo.findAllByTournamentId(tourney.id)

        val stats = calculateParticipantStats(allParticipants, pastPairings)
                .filter { !it.dropped }

        val bestPairing = manualPairings
                ?.map {
                    TournamentPairing(
                            pairingTable = it.pairingTable,
                            playerOneId = it.playerOneId,
                            playerTwoId = it.playerTwoId,
                            tournamentId = tourneyId,
                            roundId = roundToPair.id,
                            playerOneWins = stats.find { stats -> stats.participant.id == it.playerOneId }?.wins ?: 0,
                            playerTwoWins = stats.find { stats -> stats.participant.id == it.playerTwoId }?.wins ?: 0,
                    )
                }
                ?: pairPlayers(tourney.id, roundToPair.id, tourney.pairingStrategy, stats, pastPairings)

        tournamentPairingRepo.saveAll(bestPairing)
        tourneyRepo.save(
                tourney
                        .let { if (it.started == null) it.copy(started = nowLocal()) else it }
                        .copy(stage = TournamentStage.PAIRING_IN_PROGRESS)
        )
    }

    fun startCurrentRound(tourneyId: Long) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val currentRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to start.")
        tournamentRoundRepo.save(currentRound.copy(active = true, startedOn = nowLocal()))
        tourneyRepo.save(tourney.copy(stage = TournamentStage.GAMES_IN_PROGRESS))

        val pairings = tournamentPairingRepo.findAllByRoundId(currentRound.id)
        val allParticipants = tournamentParticipantRepo.findAllByTournamentId(tourney.id)
        val pastPairings = tournamentPairingRepo.findAllByTournamentId(tourney.id)
        val stats = calculateParticipantStats(allParticipants, pastPairings)

        val bye = pairings.find { it.playerTwoId == null }

        if (bye != null) {
            tournamentPairingRepo.save(
                    bye.copy(playerOneWon = true, playerOneScore = 3)
            )
        }

        val pairDowns = pairings.mapNotNull { pairing ->
            val playerOneWins = stats.find { it.participant.id == pairing.playerOneId }
            val playerTwoWins = stats.find { it.participant.id == pairing.playerTwoId }
            if (playerOneWins == playerTwoWins || playerTwoWins == null || playerOneWins == null) {
                null
            } else if (playerOneWins.wins < playerTwoWins.wins) {
                pairing.playerOneId
            } else {
                pairing.playerTwoId
            }
        }

        pairDowns.forEach { pairDownId ->
            val participant = allParticipants.find { it.id == pairDownId }
            if (participant != null) {
                tournamentParticipantRepo.save(participant.copy(pairedDown = true))
            }
        }
    }

    fun endTournament(tourneyId: Long, end: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)

        if (end && tourney.stage != TournamentStage.VERIFYING_ROUND_RESULTS) {
            throw BadRequestException("Can only end tournaments in verifying results status.")
        }
        if (!end && tourney.stage != TournamentStage.TOURNAMENT_COMPLETE) {
            throw BadRequestException("Can only unend tournaments in complete status.")
        }

        if (end) {
            val lastRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to close.")
            tournamentRoundRepo.save(lastRound.copy(active = false))
            tourneyRepo.save(tourney.copy(stage = TournamentStage.TOURNAMENT_COMPLETE, ended = nowLocal()))
        } else {
            val lastRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to reopen.")
            tournamentRoundRepo.save(lastRound.copy(active = true))
            tourneyRepo.save(tourney.copy(stage = TournamentStage.VERIFYING_ROUND_RESULTS, ended = null))
        }
    }

    fun addTo(tourneyId: Long, toUsername: String) {
        val tourney = verifyTournamentAdmin(tourneyId)

        if (tourney.organizers.any { it.organizer.username == toUsername }) throw BadRequestException("$toUsername is already a TO for this tournament.")

        val organizer = keyUserRepo.findByUsernameIgnoreCase(toUsername) ?: throw BadRequestException("No user with username $toUsername")

        tournamentOrganizerRepo.save(TournamentOrganizer(
                tourney = tourney,
                organizer = organizer,
        ))
    }

    fun removeTo(tourneyId: Long, toUsername: String) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val toDelete = tourney.organizers.find { it.organizer.username == toUsername }
                ?: throw BadRequestException("$toUsername is not a TO for this tournament.")

        tournamentOrganizerRepo.delete(toDelete)
    }

    fun addParticipant(tourneyId: Long, participantUsername: String) {
        val (user, participant, tourney) = verifyTournamentAdminOrParticipant(participantUsername, tourneyId)

        val isOrganizer = tournamentOrganizerRepo.existsByTourneyIdAndOrganizerId(tourneyId, user.id)

        if (tourney.privateTourney && !isOrganizer) {
            throw UnauthorizedException("Must be tournament organizer to add participant to private tourney.")
        }

        if (tourney.registrationClosed && !isOrganizer) {
            throw BadRequestException("Registration for this tournament has been closed. Please contact the TO.")
        }

        if (tourney.stage != TournamentStage.TOURNAMENT_NOT_STARTED) {
            throw BadRequestException("Tournament has already started, participant cannot be added.")
        }

        if (tournamentParticipantRepo.existsByTournamentIdAndUserId(tourney.id, participant.id)) throw BadRequestException("$participantUsername is already in this tournament.")

        tournamentParticipantRepo.save(TournamentParticipant(
                tournament = tourney,
                userId = participant.id,
        ))
    }

    fun dropParticipant(tourneyId: Long, participantUsername: String, drop: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val participant = keyUserRepo.findByUsernameIgnoreCase(participantUsername) ?: throw BadRequestException("No user with username $participantUsername")

        val participantRecord = tournamentParticipantRepo.findByTournamentIdAndUserId(tourney.id, participant.id)
                ?: throw BadRequestException("No participant found.")

        if (tourney.stage == TournamentStage.TOURNAMENT_NOT_STARTED) {
            tournamentDeckRepo.deleteByParticipantId(participantRecord.id)
            tournamentParticipantRepo.delete(participantRecord)
        } else {
            tournamentParticipantRepo.save(participantRecord.copy(dropped = drop))
        }
    }

    fun verifyParticipant(tourneyId: Long, participantUsername: String, verify: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val participant = keyUserRepo.findByUsernameIgnoreCase(participantUsername) ?: throw BadRequestException("No user with username $participantUsername")

        val participantRecord = tournamentParticipantRepo.findByTournamentIdAndUserId(tourney.id, participant.id)
                ?: throw BadRequestException("No participant found.")

        tournamentParticipantRepo.save(participantRecord.copy(verified = verify))
    }

    fun reportResults(results: TournamentResults) {
        val user = currentUserService.loggedInUserOrUnauthorized()

        val pairing = tournamentPairingRepo.findByIdOrNull(results.pairingId) ?: throw BadRequestException("No pairing with id ${results.pairingId}")
        val tourney = tourneyRepo.findByIdOrNull(pairing.tournamentId) ?: throw BadRequestException("No tourney with id ${pairing.tournamentId}")

        val ids: List<Long> = listOfNotNull(pairing.playerOneId, pairing.playerTwoId)

        val userTourneyId: Long? = tournamentParticipantRepo.findByTournamentIdAndUserId(tourney.id, user.id)?.id

        val isOrganizer = tournamentOrganizerRepo.existsByTourneyIdAndOrganizerId(pairing.tournamentId, user.id)
        val isResultsPlayer = userTourneyId != null && ids.contains(userTourneyId)

        val currentRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourney.id) ?: throw BadRequestException("No rounds.")

        if (!isOrganizer && !isResultsPlayer) {
            throw UnauthorizedException("Must be tournament organizer or player to report results.")
        }

        if (!isOrganizer && pairing.playerOneWon != null) {
            throw UnauthorizedException("Results for this match have already been reported.")
        }

        tournamentPairingRepo.save(pairing.copy(
                playerOneWon = results.playerOneWon,
                playerOneScore = results.playerOneScore,
                playerTwoScore = results.playerTwoScore,
        ))

        if (currentRound.id == pairing.roundId && !tournamentPairingRepo.existsByRoundIdAndPlayerOneWonIsNull(pairing.roundId)) {
            tourneyRepo.save(tourney.copy(stage = TournamentStage.VERIFYING_ROUND_RESULTS))
        }
    }

    fun addDeck(tourneyId: Long, deckId: String, username: String) {
        val (currentUser, participant, tourney) = verifyTournamentAdminOrParticipant(username, tourneyId)


        val participantRecord = tournamentParticipantRepo.findByTournamentIdAndUserId(tourneyId, participant.id)
                ?: throw UnauthorizedException("You must be in the tournament to add a deck.")

        if (tourney.deckChoicesLocked && participantRecord.userId == currentUser.id) {
            throw UnauthorizedException("The tournament organizer has locked deck selection for this event. Please contact the TO.")
        }

        val deck = deckRepo.findByKeyforgeId(deckId) ?: throw BadRequestException("No deck with id $deckId")

        val participantDecks = tournamentDeckRepo.findByParticipantId(participantRecord.id)
        val nextOrder: Int = (participantDecks.map { it.deckOrder }.maxOrNull() ?: 0) + 1

        tournamentDeckRepo.save(TournamentDeck(
                deck = deck,
                participantId = participantRecord.id,
                tourneyId = tourney.id,
                deckOrder = nextOrder,
        ))
    }

    fun changingPairingStrategy(tourneyId: Long, strategy: PairingStrategy) {
        val tourney = verifyTournamentAdmin(tourneyId)
        tourneyRepo.save(tourney.copy(pairingStrategy = strategy))
    }

    fun extendCurrentRound(tourneyId: Long, minutes: Int) {
        val tourney = verifyTournamentAdmin(tourneyId)
        val currentRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourney.id) ?: throw BadRequestException("No rounds.")

        if (!currentRound.active) {
            throw BadRequestException("Cannot extend time after round is over.")
        }

        tournamentRoundRepo.save(currentRound.copy(timeExtendedMinutes = minutes))
    }

    fun lockRegistration(tourneyId: Long, lock: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)
        tourneyRepo.save(tourney.copy(registrationClosed = lock))
    }

    fun togglePrivate(tourneyId: Long, privateTourney: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)
        tourneyRepo.save(tourney.copy(privateTourney = privateTourney))
    }

    fun lockDeckRegistration(tourneyId: Long, lock: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)
        tourneyRepo.save(tourney.copy(deckChoicesLocked = lock))
    }

    fun removeDeck(tourneyId: Long, tournamentDeckId: Long) {
        verifyTournamentAdmin(tourneyId)
        tournamentDeckRepo.deleteById(tournamentDeckId)
    }

    fun changeTournamentParticipant(tourneyId: Long, previousUsername: String, newUsername: String) {
        val tournament = verifyTournamentAdmin(tourneyId)
        if (tournament.ended != null) {
            throw BadRequestException("Can't change participants in a tournament that has ended.")
        }
        val previousUser = keyUserRepo.findByUsernameIgnoreCase(previousUsername)
                ?: throw BadRequestException("No user for previous username $previousUsername")
        val newUser = keyUserRepo.findByUsernameIgnoreCase(newUsername) ?: throw BadRequestException("Couldn't find a user with the username $newUsername")
        val participant = tournamentParticipantRepo.findByTournamentIdAndUserId(tourneyId, previousUser.id)
                ?: throw BadRequestException("No tournament participant with the username $previousUsername")
        tournamentParticipantRepo.save(participant.copy(userId = newUser.id))
    }

    private fun calculateParticipantStats(allParticipants: List<TournamentParticipant>, pairings: List<TournamentPairing>): List<ParticipantStats> {

        val statsMap: Map<Long, ParticipantStats> = allParticipants
                .map { player ->
                    val games = pairings.filter { it.playerOneWon != null && (it.playerOneId == player.id || it.playerTwoId == player.id) }
                    val winCount = games.count { if (it.playerOneId == player.id) it.playerOneWon!! else !it.playerOneWon!! }
                    val byeCount = games.count { it.playerTwoId == null }
                    player.id to ParticipantStats(
                            participant = player,
                            wins = winCount,
                            losses = games.size - winCount,
                            byes = byeCount,
                            strengthOfSchedule = 0.0,
                            extendedStrengthOfSchedule = 0.0,
                            score = games.sumOf { if (it.playerOneId == player.id) it.playerOneScore ?: 0 else it.playerTwoScore ?: 0 },
                            opponentsScore = games.sumOf { if (it.playerOneId == player.id) it.playerTwoScore ?: 0 else it.playerOneScore ?: 0 },
                            dropped = player.dropped,
                    )
                }
                .toMap()

        if (pairings.isEmpty()) {
            return statsMap.values.toList()
        }

        val statsMapWithSos: Map<Long, ParticipantStats> = statsMap.values
                .map { playerStats ->
                    val player = playerStats.participant
                    val opponentIds = findOpponentIds(pairings, player)

                    val sos = if (opponentIds.isEmpty()) 0.0 else opponentIds
                            .map {
                                val opponent = statsMap[it]!!
                                if (opponent.wins == 0) {
                                    0.0
                                } else {
                                    opponent.wins.toDouble() / (opponent.wins.toDouble() + opponent.losses.toDouble())
                                }
                            }
                            .sum() / opponentIds.size
                    player.id to playerStats.copy(strengthOfSchedule = sos)
                }
                .toMap()

        return statsMapWithSos.values
                .map { playerStats ->
                    val player = playerStats.participant
                    val opponentIds = findOpponentIds(pairings, player)
                    val extendedSos = if (opponentIds.isEmpty()) 0.0 else opponentIds
                            .map {
                                val opponent = statsMapWithSos[it]!!
                                opponent.strengthOfSchedule
                            }
                            .sum() / opponentIds.size
                    playerStats.copy(extendedStrengthOfSchedule = extendedSos)
                }
    }

    private fun pairPlayers(
            tourneyId: Long,
            roundId: Long,
            pairingStrategy: PairingStrategy,
            participantStats: List<ParticipantStats>,
            previousPairings: List<TournamentPairing>
    ): List<TournamentPairing> {

        val playerWithBye: ParticipantStats? = if (participantStats.size % 2 == 1) {
            val fewestByes = participantStats.minByOrNull { it.byes }!!.byes
            val findWithWinCount = participantStats.sortedBy { it.wins }.find { it.byes == fewestByes }!!.wins
            participantStats.filter { it.wins == findWithWinCount && it.byes == fewestByes }.random()
        } else {
            null
        }

        val unevenGroupings = participantStats
                .let { if (playerWithBye == null) it else it.minus(playerWithBye) }
                .shuffled()
                .let {
                    if (pairingStrategy == PairingStrategy.SWISS_SOS) {
                        it
                                .sortedWith(participantStatsComparator)
                                .reversed()
                    } else {
                        it
                    }
                }
                .groupBy { it.wins }
                .toMap()
                .toSortedMap(Comparator.reverseOrder())

        val groups: List<List<ParticipantStats>> = if (unevenGroupings.size > 1 && unevenGroupings[unevenGroupings.lastKey()]!!.size == 1) {

            val firstGroups = unevenGroupings.toList().dropLast(2)
            val lastTwoGroups = unevenGroupings.toList().takeLast(2)
            val secondToLastGroup = lastTwoGroups.first()
            val lastCombined = Pair(secondToLastGroup.first, lastTwoGroups.flatMap { it.second })

            firstGroups.plus(lastCombined)
                    .map { it.second }

        } else {
            unevenGroupings.map { it.value }
        }

        val pairings = mutableListOf<TournamentPairing>()
        var extraPlayer: ParticipantStats? = null

        var nextTable = 1

        groups.forEach { participants ->

            val fullGroup = if (extraPlayer == null) participants else listOf(extraPlayer!!).plus(participants)

            val participantIdToOpponentIds = fullGroup
                    .map { it.participant.id to findOpponentIds(previousPairings, it.participant) }
                    .toMap()

            val groupPairings = if (pairingStrategy == PairingStrategy.SWISS_SOS) {

                val sosValues = fullGroup.map { it.totalSosScore() }.toSet().toList().sortedDescending()

                log.info("Sos set: $sosValues")

                pairWinGroupBySos(nextTable, fullGroup, participantIdToOpponentIds, tourneyId, roundId, sosValues)
            } else {
                pairWinGroupByRandom(nextTable, fullGroup, participantIdToOpponentIds, tourneyId, roundId)
            }

            extraPlayer = groupPairings.pairDown

            nextTable += groupPairings.pairings.size

            pairings.addAll(groupPairings.pairings)
        }

        if (playerWithBye != null) {
            pairings.add(TournamentPairing(
                    pairingTable = nextTable,
                    playerOneId = playerWithBye.participant.id,
                    playerTwoId = null,
                    tournamentId = tourneyId,
                    roundId = roundId,
                    playerOneWins = playerWithBye.wins
            ))
        }

        return pairings
    }

    private fun pairWinGroupByRandom(
            nextTable: Int,
            players: List<ParticipantStats>,
            participantIdToOpponentIds: Map<Long, List<Long>>,
            tourneyId: Long,
            roundId: Long,
    ): GroupPairingResults {

        val timesToRepair = 1000

        val totalPairings = players.size / 2

        var bestResults = pairPlayersByRandom(
                nextTable, players, participantIdToOpponentIds, tourneyId, roundId
        )

        var timesPaired = 0

        val millisTaken = measureTimeMillis {

            while (bestResults.rematchPoints > 0 && timesPaired < timesToRepair) {
                timesPaired++

                val potentialResults = pairPlayersByRandom(
                        nextTable, players, participantIdToOpponentIds, tourneyId, roundId
                )

                if (potentialResults.rematchPoints < bestResults.rematchPoints) {
                    bestResults = potentialResults
                }
            }
        }

        log.info(
                """
                    Paired group randomly with $totalPairings pairings.
                    Repaired $timesPaired times in $millisTaken ms. 
                    Best rematch points ${bestResults.rematchPoints}. 
                    Best SOS points ${bestResults.sosPoints}.
                """.trimIndent()
        )

        return bestResults
    }


    private fun pairPlayersByRandom(
            nextTable: Int,
            players: List<ParticipantStats>,
            participantIdToOpponentIds: Map<Long, List<Long>>,
            tourneyId: Long,
            roundId: Long,
    ): GroupPairingResults {

        val playersToPair = players.toMutableList()

        val pairings = mutableListOf<TournamentPairing>()

        var rematchPoints = 0
        var sequenceIdx = 0

        while (playersToPair.size > 1) {
            val firstPlayer = playersToPair.removeFirst()
            val opponentIds = participantIdToOpponentIds[firstPlayer.participant.id]!!

            var opponent = playersToPair.find {
                !opponentIds.contains(it.participant.id)
            }

            if (opponent == null) {
                opponent = playersToPair.firstOrNull()!!
                rematchPoints += 100
            }


            playersToPair.remove(opponent)

            pairings.add(TournamentPairing(
                    pairingTable = nextTable + sequenceIdx,
                    playerOneId = firstPlayer.participant.id,
                    playerTwoId = opponent.participant.id,
                    tournamentId = tourneyId,
                    roundId = roundId,
                    playerOneWins = firstPlayer.wins,
                    playerTwoWins = opponent.wins,
            ))

            sequenceIdx++
        }

        val pairDown = playersToPair.firstOrNull()


        return GroupPairingResults(
                rematchPoints,
                0,
                pairings,
                pairDown,
        )
    }

    private fun pairWinGroupBySos(
            nextTable: Int,
            players: List<ParticipantStats>,
            participantIdToOpponentIds: Map<Long, List<Long>>,
            tourneyId: Long,
            roundId: Long,
            sosValues: List<Double>
    ): GroupPairingResults {

        val timesToRepair = 1000

        val totalPairings = players.size / 2

        var bestResults = pairPlayersBySosWithRandom(
                nextTable, players, participantIdToOpponentIds, tourneyId, roundId, sosValues, null
        )

        val lowestSosPoints = bestResults.sosPoints

        var timesPaired = 0

        val millisTaken = measureTimeMillis {

            while ((bestResults.rematchPoints + bestResults.sosPoints > lowestSosPoints) && timesPaired < timesToRepair) {
                timesPaired++

                // from 1 to half of all pairings random
                val randomPairings = 1 + (((totalPairings - 1) * timesPaired) / (timesToRepair * 2))

                val randomPairingSequence = (0..randomPairings).map { true }
                        .plus((0..(totalPairings - randomPairings)).map { false })
                        .shuffled()

                val potentialResults = pairPlayersBySosWithRandom(
                        nextTable, players, participantIdToOpponentIds, tourneyId, roundId, sosValues, randomPairingSequence
                )

                if (potentialResults.rematchPoints + potentialResults.sosPoints < bestResults.rematchPoints + bestResults.sosPoints) {
                    bestResults = potentialResults
                }
            }
        }

        log.info(
                """
                    Paired group by SOS with $totalPairings pairings.
                    Repaired $timesPaired times in $millisTaken ms. 
                    Best rematch points ${bestResults.rematchPoints}. 
                    Best SOS points ${bestResults.sosPoints}.
                """.trimIndent()
        )

        return bestResults
    }


    private fun pairPlayersBySosWithRandom(
            nextTable: Int,
            players: List<ParticipantStats>,
            participantIdToOpponentIds: Map<Long, List<Long>>,
            tourneyId: Long,
            roundId: Long,
            sosValues: List<Double>,
            randomPairingsSequence: List<Boolean>?,
    ): GroupPairingResults {

        val playersToPair = players.toMutableList()

        val pairings = mutableListOf<TournamentPairing>()

        var rematchPoints = 0
        var sosSimilarityPoints = 0
        var sequenceIdx = 0

        while (playersToPair.size > 1) {
            val firstPlayer = playersToPair.removeFirst()
            val opponentIds = participantIdToOpponentIds[firstPlayer.participant.id]!!

            val opponent = if (randomPairingsSequence != null && randomPairingsSequence[sequenceIdx]) {
                val randomOpponent = playersToPair.removeAt(Random.nextInt(playersToPair.size))

                if (opponentIds.contains(randomOpponent.participant.id)) {
                    rematchPoints += 100
                }

                randomOpponent
            } else {
                var opponent = playersToPair.find {
                    !opponentIds.contains(it.participant.id)
                }

                if (opponent == null) {
                    opponent = playersToPair.firstOrNull()!!
                    rematchPoints += 100
                }
                opponent
            }

            playersToPair.remove(opponent)

            val idxFirst = sosValues.indexOf(firstPlayer.totalSosScore())
            val idxSecond = sosValues.indexOf(opponent.totalSosScore())
            sosSimilarityPoints += (idxFirst - idxSecond).absoluteValue

            pairings.add(TournamentPairing(
                    pairingTable = nextTable + sequenceIdx,
                    playerOneId = firstPlayer.participant.id,
                    playerTwoId = opponent.participant.id,
                    tournamentId = tourneyId,
                    roundId = roundId,
                    playerOneWins = firstPlayer.wins,
                    playerTwoWins = opponent.wins,
            ))

            sequenceIdx++
        }

        val pairDown = playersToPair.firstOrNull()

        if (pairDown != null) {
            sosSimilarityPoints += sosValues.size - 1 - sosValues.indexOf(pairDown.totalSosScore())
        }

        return GroupPairingResults(
                rematchPoints,
                sosSimilarityPoints,
                pairings,
                pairDown,
        )
    }

    private fun findOpponentIds(pairings: List<TournamentPairing>, player: TournamentParticipant): List<Long> {
        return pairings
                .filter { it.playerOneId == player.id || it.playerTwoId == player.id }
                .mapNotNull { if (it.playerOneId == player.id) it.playerTwoId else it.playerOneId }
    }

    private fun verifyTournamentAdmin(tourneyId: Long): Tournament {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val tourney = tourneyRepo.findByIdOrNull(tourneyId) ?: throw BadRequestException("No tourney with id $tourneyId")
        if (!tournamentOrganizerRepo.existsByTourneyIdAndOrganizerId(tourneyId, user.id)) {
            throw UnauthorizedException("Must be tournament organizer to perform admin functions.")
        }
        return tourney
    }

    private fun verifyTournamentAdminOrParticipant(participantUsername: String, tourneyId: Long): Triple<KeyUser, KeyUser, Tournament> {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val participant = keyUserRepo.findByUsernameIgnoreCase(participantUsername) ?: throw BadRequestException("No user with username $participantUsername")
        val tourney = tourneyRepo.findByIdOrNull(tourneyId) ?: throw BadRequestException("No tourney with id $tourneyId")

        if (user.id != participant.id && !tournamentOrganizerRepo.existsByTourneyIdAndOrganizerId(tourneyId, user.id)) {
            throw UnauthorizedException("Must be tournament organizer or participant to add/drop participant.")
        }
        return Triple(user, participant, tourney)
    }

}

data class GroupPairingResults(
        val rematchPoints: Int,
        val sosPoints: Int,
        val pairings: List<TournamentPairing>,
        val pairDown: ParticipantStats?,
)
