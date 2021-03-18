package coraythan.keyswap.keyforgeevents.tournaments

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
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun searchTournaments(filters: KeyForgeEventFilters): List<TournamentSearchResult> {
        val events = keyForgeEventService.searchEvents(filters)
        return events.map {
            val tournament = tourneyRepo.findByIdOrNull(it.tourneyId!!)!!
            TournamentSearchResult(
                    id = tournament.id,
                    name = tournament.name,
                    private = tournament.privateTourney,
                    ended = tournament.ended,
                    event = it
            )
        }
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
                    hasVerificationImage = it.deck.hasOwnershipVerification == true
            )
        }
                .sortedBy { it.username }

        val tournamentDecksByUserName = tournamentDeckInfos.groupBy { it.username }

        return TournamentInfo(
                tourneyId = id,
                name = tourney.name,
                privateTournament = tourney.privateTourney,
                organizerUsernames = tourney.organizers.map { it.organizer.username },
                joined = user?.username != null && participantNames.values.any { it?.username == user.username },
                stage = tourney.stage,
                event = event.toDto(),
                rounds = tourney.rounds.map { round ->
                    TournamentRoundInfo(
                            roundNumber = round.roundNumber,
                            roundId = round.id,
                            pairings = tournamentPairingRepo.findAllByRoundId(round.id)
                                    .map {
                                        TournamentPairingInfo(
                                                table = it.pairingTable,
                                                pairId = it.id,
                                                playerOneId = it.playerOneId,
                                                playerOneUsername = participantNames[it.playerOneId]!!.username,
                                                playerOneWins = it.playerOneWins,
                                                playerTwoId = it.playerTwoId,
                                                playerTwoUsername = participantNames[it.playerTwoId]?.username,
                                                playerTwoWins = if (it.playerTwoId == null) null else it.playerTwoWins,
                                                playerOneScore = it.playerOneScore,
                                                playerTwoScore = it.playerTwoScore,
                                                playerOneWon = it.playerOneWon,
                                                tcoLink = it.tcoLink,
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
                                val username = participantNames[it.id]?.username ?: "No User"
                                val decks = tournamentDecksByUserName[username] ?: listOf()
                                TournamentRanking(
                                        ranking = 1,
                                        username = username,
                                        participantId = it.id,
                                        wins = stats.wins,
                                        losses = stats.losses,
                                        byes = stats.byes,
                                        strengthOfSchedule = stats.strengthOfSchedule,
                                        extendedStrengthOfSchedule = stats.extendedStrengthOfSchedule,
                                        score = stats.score,
                                        opponentsScore = stats.opponentsScore,
                                        dropped = it.dropped,
                                        decks = decks
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

    fun pairNextRound(tourneyId: Long) {
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
                            roundNumber = nextRoundNumber
                    )
            )
        }

        val allParticipants = tournamentParticipantRepo.findAllByTournamentId(tourney.id)
        val activeCount = allParticipants.count { !it.dropped }

        if (activeCount < 2) {
            throw BadRequestException("Can't pair round with fewer than 2 players.")
        }

        val tournamentId = allParticipants.first().tournamentId

        val pastPairings = tournamentPairingRepo.findAllByTournamentId(tournamentId)

        val stats = calculateParticipantStats(allParticipants, pastPairings)
                .filter { !it.dropped }

        val bestPairing = pairPlayers(tournamentId, roundToPair.id, stats, pastPairings)

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
        tournamentRoundRepo.save(currentRound.copy(active = true))
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

        if (tourney.privateTourney && !tournamentOrganizerRepo.existsByTourneyIdAndOrganizerId(tourneyId, user.id)) {
            throw UnauthorizedException("Must be tournament organizer to add participant to private tourney.")
        }

        if (tourney.stage != TournamentStage.TOURNAMENT_NOT_STARTED) {
            throw BadRequestException("Tournament has already started, participant cannot be added.")
        }

        if (tournamentParticipantRepo.existsByTournamentIdAndUserId(tourney.id, participant.id)) throw BadRequestException("$participantUsername is already in this tournament.")

        tournamentParticipantRepo.save(TournamentParticipant(
                tournamentId = tourney.id,
                userId = participant.id,
        ))
    }

    fun dropParticipant(tourneyId: Long, participantUsername: String, drop: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val participant = keyUserRepo.findByUsernameIgnoreCase(participantUsername) ?: throw BadRequestException("No user with username $participantUsername")

        val participantRecord = tournamentParticipantRepo.findByTournamentIdAndUserId(tourney.id, participant.id)
                ?: throw BadRequestException("No participant found.")

        if (tourney.stage == TournamentStage.TOURNAMENT_NOT_STARTED) {
            tournamentParticipantRepo.delete(participantRecord)
        } else {
            tournamentParticipantRepo.save(participantRecord.copy(dropped = drop))
        }
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
            throw UnauthorizedException("Only the TO can modify results once submitted.")
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
        val (_, participant, tourney) = verifyTournamentAdminOrParticipant(username, tourneyId)

        val participantRecord = tournamentParticipantRepo.findByTournamentIdAndUserId(tourneyId, participant.id)
                ?: throw UnauthorizedException("You must be in the tournament to add a deck.")

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
                            score = games.sumBy { if (it.playerOneId == player.id) it.playerOneScore ?: 0 else it.playerTwoScore ?: 0 },
                            opponentsScore = games.sumBy { if (it.playerOneId == player.id) it.playerTwoScore ?: 0 else it.playerOneScore ?: 0 },
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
            eventId: Long,
            roundId: Long,
            participantStats: List<ParticipantStats>,
            previousPairings: List<TournamentPairing>
    ): List<TournamentPairing> {

        val unevenGroupings = participantStats
                .shuffled()
                .sortedWith(participantStatsComparator)
                .reversed()
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

            val sosValues = fullGroup.map { it.totalSosScore() }.toSet().toList().sortedDescending()

            log.info("Sos set: $sosValues")

            val participantIdToOpponentIds = fullGroup
                    .map { it.participant.id to findOpponentIds(previousPairings, it.participant) }
                    .toMap()

            val groupPairings = pairPlayersToFindBest(nextTable, fullGroup, participantIdToOpponentIds, eventId, roundId, sosValues)

            extraPlayer = groupPairings.pairDown

            nextTable += groupPairings.pairings.size

            pairings.addAll(groupPairings.pairings)
        }

        if (extraPlayer != null) {
            // Last extra player is the bye

            pairings.add(TournamentPairing(
                    pairingTable = nextTable,
                    playerOneId = extraPlayer!!.participant.id,
                    playerTwoId = null,
                    tournamentId = eventId,
                    roundId = roundId,
                    playerOneWins = extraPlayer!!.wins
            ))
        }

        return pairings
    }

    private fun pairPlayersToFindBest(
            nextTable: Int,
            players: List<ParticipantStats>,
            participantIdToOpponentIds: Map<Long, List<Long>>,
            eventId: Long,
            roundId: Long,
            sosValues: List<Double>
    ): GroupPairingResults {

        val timesToRepair = 1000

        val totalPairings = players.size / 2

        var bestResults = pairPlayersBySos(
                nextTable, players, participantIdToOpponentIds, eventId, roundId, sosValues, null
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

                val potentialResults = pairPlayersBySos(
                        nextTable, players, participantIdToOpponentIds, eventId, roundId, sosValues, randomPairingSequence
                )

                if (potentialResults.rematchPoints + potentialResults.sosPoints < bestResults.rematchPoints + bestResults.sosPoints) {
                    bestResults = potentialResults
                }
            }
        }

        log.info(
                """
                    Paired group with $totalPairings pairings.
                    Repaired $timesPaired times in $millisTaken ms. 
                    Best rematch points ${bestResults.rematchPoints}. 
                    Best SOS points ${bestResults.sosPoints}.
                """.trimIndent()
        )

        return bestResults
    }


    private fun pairPlayersBySos(
            nextTable: Int,
            players: List<ParticipantStats>,
            participantIdToOpponentIds: Map<Long, List<Long>>,
            eventId: Long,
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
                    tournamentId = eventId,
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
