package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.keyforgeevents.KeyForgeEventRepo
import coraythan.keyswap.keyforgeevents.tournamentdecks.*
import coraythan.keyswap.keyforgeevents.tournamentparticipants.ParticipantStats
import coraythan.keyswap.keyforgeevents.tournamentparticipants.TournamentParticipant
import coraythan.keyswap.keyforgeevents.tournamentparticipants.TournamentParticipantRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
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
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun findTourneyInfo(id: Long): TournamentInfo {
        val user = currentUserService.loggedInUser()
        val tourney = tourneyRepo.findByIdOrNull(id) ?: throw BadRequestException("No event for id $id")

        val participants = tournamentParticipantRepo.findAllByEventId(id)
        val pairings = tournamentPairingRepo.findAllByEventId(id)
        val participantNames = participants
                .map { it.id to keyUserRepo.findByIdOrNull(it.userId) }
                .toMap()
        val participantStats = calculateParticipantStats(participants, pairings)
                .map { it.participant.id to it }
                .toMap()

        return TournamentInfo(
                tourneyId = id,
                name = tourney.name,
                privateTournament = tourney.privateTourney,
                organizerUsernames = tourney.organizers.map { it.organizer.username },
                joined = user?.username != null && participantNames.values.any { it?.username == user.username },
                stage = tourney.stage,
                rounds = tourney.rounds.map { round ->
                    TournamentRoundInfo(
                            roundNumber = round.roundNumber,
                            roundId = round.id,
                            pairings = tournamentPairingRepo.findAllByRoundId(round.id).map {
                                TournamentPairingInfo(
                                        pairId = it.id,
                                        playerOneId = it.playerOneId,
                                        playerOneUsername = participantNames[it.playerOneId]!!.username,
                                        playerTwoId = it.playerTwoId,
                                        playerTwoUsername = participantNames[it.playerTwoId]?.username,
                                        playerOneKeys = it.playerOneKeys,
                                        playerTwoKeys = it.playerTwoKeys,
                                        playerOneWon = it.playerOneWon,
                                        tcoLink = it.tcoLink,
                                )
                            }
                    )
                }.sortedBy { it.roundNumber },
                rankings = participants
                        .mapNotNull {
                            val stats = participantStats[it.id]
                            if (stats == null) {
                                null
                            } else {
                                TournamentRanking(
                                        ranking = 1,
                                        username = participantNames[it.id]?.username ?: "No User",
                                        participantId = it.id,
                                        wins = stats.wins,
                                        losses = stats.losses,
                                        byes = stats.byes,
                                        strengthOfSchedule = stats.strengthOfSchedule,
                                        extendedStrengthOfSchedule = stats.extendedStrengthOfSchedule,
                                        keys = stats.keys,
                                        opponentKeys = stats.opponentKeys,
                                        dropped = it.dropped,
                                )
                            }
                        }
                        .sortedBy { (it.wins * 10000) + (it.strengthOfSchedule * 100) + it.extendedStrengthOfSchedule - (if (it.dropped) 1000000 else 0) }
                        .reversed()
                        .mapIndexed { index, tournamentRanking -> tournamentRanking.copy(ranking = index + 1) },
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

        val activeParticipants = tournamentParticipantRepo.findAllByEventIdAndDroppedFalse(tourney.id)

        if (activeParticipants.size < 2) {
            throw BadRequestException("Can't pair round with fewer than 2 players.")
        }

        val eventId = activeParticipants.first().eventId

        if (activeParticipants.size < 2) throw BadRequestException("Can't pair next round with only one participant.")

        val pastPairings = tournamentPairingRepo.findAllByEventId(eventId)

        val stats = calculateParticipantStats(activeParticipants, pastPairings)

        // do it 100 times find lowest rematch points?

        var bestPairing: GeneratedPairings? = null
        var pairedTimes = 0

        val duration = measureTimeMillis {
            while (bestPairing == null || (bestPairing!!.rematchPoints != 0 && pairedTimes < 100)) {
                pairedTimes++
                val previousPairing = bestPairing
                val newPairing = pairPlayers(eventId, roundToPair.id, stats, pastPairings)
                if (previousPairing == null || newPairing.rematchPoints < previousPairing.rematchPoints) {
                    bestPairing = newPairing
                } else {
                    bestPairing = previousPairing
                }
            }
        }

        log.info("Took $duration ms to pair ${activeParticipants.size} participants $pairedTimes times.")

        tournamentPairingRepo.saveAll(bestPairing!!.pairings)
        tourneyRepo.save(tourney.copy(stage = TournamentStage.PAIRING_IN_PROGRESS))
    }

    fun startCurrentRound(tourneyId: Long) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val currentRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to start.")
        tournamentRoundRepo.save(currentRound.copy(active = true))
        tourneyRepo.save(tourney.copy(stage = TournamentStage.GAMES_IN_PROGRESS))

        val bye = tournamentPairingRepo.findByRoundIdAndPlayerTwoIdIsNull(currentRound.id)
        if (bye != null) {
            tournamentPairingRepo.save(
                    bye.copy(playerOneWon = true, playerOneKeys = 3)
            )
        }
    }

    fun endTournament(tourneyId: Long) {
        val tourney = verifyTournamentAdmin(tourneyId)

        if (tourney.stage != TournamentStage.VERIFYING_ROUND_RESULTS) {
            throw BadRequestException("Can only end tournaments in verifying results status.")
        }

        val lastRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to start.")
        tournamentRoundRepo.save(lastRound.copy(active = false))
        tourneyRepo.save(tourney.copy(stage = TournamentStage.TOURNAMENT_COMPLETE))
    }

    fun addParticipant(tourneyId: Long, participantUsername: String) {
        val (user, participant, tourney) = verifyTournamentAdminOrParticipant(participantUsername, tourneyId)

        if (tourney.privateTourney && !tournamentOrganizerRepo.existsByTourneyIdAndOrganizerId(tourneyId, user.id)) {
            throw UnauthorizedException("Must be tournament organizer to add participant to private tourney.")
        }

        if (tourney.stage != TournamentStage.TOURNAMENT_NOT_STARTED) {
            throw BadRequestException("Tournament has already started, participant cannot be added.")
        }

        tournamentParticipantRepo.save(TournamentParticipant(
                eventId = tourney.id,
                userId = participant.id,
        ))
    }

    fun dropParticipant(tourneyId: Long, participantUsername: String) {
        val (_, participant, tourney) = verifyTournamentAdminOrParticipant(participantUsername, tourneyId)

        val participantRecord = tournamentParticipantRepo.findByEventIdAndUserId(tourney.id, participant.id)
                ?: throw BadRequestException("No participant found.")

        tournamentParticipantRepo.save(participantRecord.copy(dropped = true))
    }

    fun reportResults(results: TournamentResults) {
        val user = currentUserService.loggedInUserOrUnauthorized()

        val pairing = tournamentPairingRepo.findByIdOrNull(results.pairingId) ?: throw BadRequestException("No pairing with id ${results.pairingId}")
        val tourney = tourneyRepo.findByIdOrNull(pairing.eventId) ?: throw BadRequestException("No tourney with id ${pairing.eventId}")

        val ids: List<Long> = listOfNotNull(pairing.playerOneId, pairing.playerTwoId)

        val userTourneyId: Long? = tournamentParticipantRepo.findByEventIdAndUserId(tourney.id, user.id)?.id

        val isOrganizer = tournamentOrganizerRepo.existsByTourneyIdAndOrganizerId(pairing.eventId, user.id)
        val isResultsPlayer = userTourneyId != null && ids.contains(userTourneyId)

        if (!isOrganizer && !isResultsPlayer) {
            throw UnauthorizedException("Must be tournament organizer or player to report results.")
        }

        if (!isOrganizer && pairing.playerOneWon != null) {
            throw UnauthorizedException("Only the TO can modify results once submitted.")
        }

        tournamentPairingRepo.save(pairing.copy(
                playerOneWon = results.playerOneWon,
                playerOneKeys = results.playerOneKeys,
                playerTwoKeys = results.playerTwoKeys,
        ))

        if (!tournamentPairingRepo.existsByRoundIdAndPlayerOneWonIsNull(pairing.roundId)) {
            tourneyRepo.save(tourney.copy(stage = TournamentStage.VERIFYING_ROUND_RESULTS))
        }
    }

    private fun calculateParticipantStats(participants: List<TournamentParticipant>, pairings: List<TournamentPairing>): List<ParticipantStats> {

        val statsMap: Map<Long, ParticipantStats> = participants
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
                            keys = games.sumBy { if (it.playerOneId == player.id) it.playerOneKeys ?: 0 else it.playerTwoKeys ?: 0 },
                            opponentKeys = games.sumBy { if (it.playerOneId == player.id) it.playerTwoKeys ?: 0 else it.playerOneKeys ?: 0 },
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
                                val opponent = statsMap[it]!!
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
    ): GeneratedPairings {

        val unevenGroupings = participantStats
                .groupBy { it.wins }
                .toMap()
                .toSortedMap(Comparator.reverseOrder())

        val playerGroups = mutableListOf<Pair<Int, List<ParticipantStats>>>()
        var extraPlayer: ParticipantStats? = null

        unevenGroupings.forEach { (group, participants) ->
            val randomPlayer = participants.random()
            val withExtra = participants
                    .plus(extraPlayer)
                    .filterNotNull()
            extraPlayer = null
            if (withExtra.size % 2 == 0) {
                playerGroups.add(Pair(group, withExtra))
            } else {
                playerGroups.add(Pair(group, withExtra.minus(randomPlayer)))
                extraPlayer = randomPlayer
            }
        }

        // If there will be a bye, decide that now before putting drop down player into last group. Shuffle + pick from players without a bye

        if (extraPlayer != null) {
            val lastGroup = playerGroups.removeLast()
            playerGroups.add(Pair(lastGroup.first, lastGroup.second.plus(extraPlayer!!)))
        }

        val pairings = mutableListOf<TournamentPairing>()

        var rematchPoints = 0

        log.info("Player groups: $playerGroups")

        playerGroups.forEach { groupInfo ->
            val wins = groupInfo.first
            val group = groupInfo.second
            val shuffledGroup = group.shuffled().toMutableList()

            while (shuffledGroup.isNotEmpty()) {
                val firstPlayer = shuffledGroup.removeFirst()
                val opponentIds = findOpponentIds(previousPairings, firstPlayer.participant)
                var opponent = shuffledGroup.find {
                    !opponentIds.contains(it.participant.id)
                }

                if (opponent == null) {
                    opponent = shuffledGroup.firstOrNull()
                    if (opponent != null) {
                        rematchPoints += wins
                    }
                }

                if (opponent != null) {
                    shuffledGroup.remove(opponent)
                }

                pairings.add(TournamentPairing(
                        playerOneId = firstPlayer.participant.id,
                        playerTwoId = opponent?.participant?.id,
                        eventId = eventId,
                        roundId = roundId
                ))
            }
        }
        return GeneratedPairings(rematchPoints, pairings)
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

data class GeneratedPairings(
        val rematchPoints: Int,
        val pairings: List<TournamentPairing>,
)
