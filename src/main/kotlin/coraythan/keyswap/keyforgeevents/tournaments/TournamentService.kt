package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.keyforgeevents.KeyForgeEvent
import coraythan.keyswap.keyforgeevents.KeyForgeEventRepo
import coraythan.keyswap.keyforgeevents.tournamentdecks.*
import coraythan.keyswap.keyforgeevents.tournamentparticipants.ParticipantStats
import coraythan.keyswap.keyforgeevents.tournamentparticipants.TournamentParticipant
import coraythan.keyswap.keyforgeevents.tournamentparticipants.TournamentParticipantRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class TournamentService(
        private val currentUserService: CurrentUserService,
        private val tournamentDeckRepo: TournamentDeckRepo,
        private val tournamentPairingRepo: TournamentPairingRepo,
        private val tournamentParticipantRepo: TournamentParticipantRepo,
        private val tournamentRoundRepo: TournamentRoundRepo,
        private val keyForgeEventRepo: KeyForgeEventRepo,
        private val keyUserRepo: KeyUserRepo,
) {

    fun findTourneyInfo(id: Long): TournamentInfo {
        val tourney = keyForgeEventRepo.findByIdOrNull(id) ?: throw BadRequestException("No event for id $id")

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
                organizerUsername = tourney.createdBy.username,
                rounds = tourney.rounds.map { round ->
                    TournamentRoundInfo(
                            roundNumber = round.roundNumber,
                            roundId = round.id,
                            pairings = tournamentPairingRepo.findAllByRoundId(round.id).map {
                                TournamentPairingInfo(
                                        pairId = it.id,
                                        playerOneId = it.playerOneId,
                                        playerOneUsername = participantNames[it.playerOneId]?.username ?: "No User",
                                        playerTwoId = it.playerTwoId,
                                        playerTwoUsername = participantNames[it.playerOneId]?.username ?: "No User",
                                        playerOneKeys = it.playerOneKeys,
                                        playerTwoKeys = it.playerTwoKeys,
                                        playerOneWon = it.playerOneWon,
                                        tcoLink = it.tcoLink,
                                )
                            }
                    )
                },
                rankings = participants
                        .mapNotNull {
                            val stats = participantStats[it.id]
                            if (stats == null) {
                                null
                            } else {
                                TournamentRanking(
                                        username = participantNames[it.id]?.username ?: "No User",
                                        participantId = it.id,
                                        wins = stats.wins,
                                        losses = stats.losses,
                                        byes = stats.byes,
                                        strengthOfSchedule = stats.strengthOfSchedule,
                                        extendedStrengthOfSchedule = stats.extendedStrengthOfSchedule,
                                        keys = stats.keys,
                                        opponentKeys = stats.opponentKeys,
                                )
                            }
                        }
                        .sortedBy { (it.wins * 100000) + (it.strengthOfSchedule * 1000) + it.extendedStrengthOfSchedule }
                        .reversed(),
        )
    }

    fun createTourney(tourneyId: Long, privateTournament: Boolean) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val round = tournamentRoundRepo.save(TournamentRound(
                tourney = tourney,
                roundNumber = 1,
        ))

        keyForgeEventRepo.save(
                tourney.copy(
                        runTournament = true,
                        privateTournament = privateTournament,
                        rounds = listOf(round),
                )
        )
    }

    fun pairNextRound(tourneyId: Long) {
        val tourney = verifyTournamentAdmin(tourneyId)

        val lastRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to pair.")
        val nextRoundNumber = lastRound.roundNumber + 1

        val nextRound = tournamentRoundRepo.save(
                TournamentRound(
                        tourney = tourney,
                        roundNumber = nextRoundNumber
                )
        )
        tournamentRoundRepo.save(lastRound.copy(active = false))

        val activeParticipants = tournamentParticipantRepo.findAllByEventIdAndDroppedFalse(tourney.id)
        val eventId = activeParticipants.first().eventId

        if (activeParticipants.size < 2) throw BadRequestException("Can't pair next round with only one participant.")

        val pastPairings = tournamentPairingRepo.findAllByEventId(eventId)

        val stats = calculateParticipantStats(activeParticipants, pastPairings)

        val pairings = pairPlayers(eventId, nextRound.id, stats, pastPairings)

        tournamentPairingRepo.saveAll(pairings)
    }

    fun startCurrentRound(tourneyId: Long) {
        verifyTournamentAdmin(tourneyId)

        val lastRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourneyId) ?: throw BadRequestException("No round to start.")
        tournamentRoundRepo.save(lastRound.copy(active = true))
    }

    fun addParticipant(tourneyId: Long, participantUsername: String) {
        val (user, participant, tourney) = verifyTournamentAdminOrParticipant(participantUsername, tourneyId)

        if (user.id != tourney.createdBy.id && tourney.privateTournament) {
            throw UnauthorizedException("Must be tournament organizer to add participant to private tourney.")
        }

        if (tourney.rounds.size > 1 || tourney.rounds.first().active) {
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
        val tourney = keyForgeEventRepo.findByIdOrNull(pairing.eventId) ?: throw BadRequestException("No tourney with id ${pairing.eventId}")

        val ids: List<Long> = listOfNotNull(pairing.playerOneId, pairing.playerTwoId)

        val userTourneyId: Long? = tournamentParticipantRepo.findByEventIdAndUserId(tourney.id, user.id)?.id

        val isOrganizer = user.id == tourney.createdBy.id
        val isResultsPlayer = userTourneyId != null && ids.contains(userTourneyId)

        if (!isOrganizer && !isResultsPlayer) {
            throw UnauthorizedException("Must be tournament organizer or player to report results.")
        }

        val currentRound = tournamentRoundRepo.findFirstByTourneyIdOrderByRoundNumberDesc(tourney.id) ?: throw BadRequestException("No round for tournament.")

        if (pairing.roundId != currentRound.id || !currentRound.active) {
            throw BadRequestException("Round is no longer active.")
        }

        val playerOneWinner = results.winnerId == pairing.playerOneId

        tournamentPairingRepo.save(pairing.copy(
                playerOneWon = playerOneWinner,
                playerOneKeys = if (playerOneWinner) results.winnerKeys else results.loserKeys,
                playerTwoKeys = if (playerOneWinner) results.loserKeys else results.winnerKeys,
        ))
    }

    private fun calculateParticipantStats(participants: List<TournamentParticipant>, pairings: List<TournamentPairing>): List<ParticipantStats> {

        val statsMap: Map<Long, ParticipantStats> = participants
                .map { player ->
                    val games = pairings.filter { it.playerOneWon != null && (it.playerOneId == player.id || it.playerTwoId == player.id) }
                    val winCount = games.count { if (it.playerOneId == it.id) it.playerOneWon!! else !it.playerOneWon!! }
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

        val statsMapWithSos: Map<Long, ParticipantStats> = statsMap.values
                .map { playerStats ->
                    val player = playerStats.participant
                    val opponentIds = findOpponentIds(pairings, player)
                    val sos = opponentIds
                            .map {
                                val opponent = statsMap[it]!!
                                opponent.wins / (opponent.wins + opponent.losses)
                            }
                            .sum().toDouble() / opponentIds.size
                    player.id to playerStats.copy(strengthOfSchedule = sos)
                }
                .toMap()

        return statsMapWithSos.values
                .map { playerStats ->
                    val player = playerStats.participant
                    val opponentIds = findOpponentIds(pairings, player)
                    val extendedSos = opponentIds
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
    ): List<TournamentPairing> {

        val playersGrouped = participantStats
                .groupBy { it.wins }
                .map { groupedStats ->
                    (groupedStats.key * -1) to groupedStats.value.sortedBy {
                        (it.strengthOfSchedule * 1000) + it.extendedStrengthOfSchedule
                    }.reversed()
                }
                .toMap()
                .toSortedMap()

        val naivePairings = mutableListOf<TournamentPairing>()
        val alreadyGrouped = mutableListOf<Long>()

        val pairPlayers = { playerOne: ParticipantStats, playerTwo: ParticipantStats? ->
            naivePairings.add(TournamentPairing(
                    playerOneId = playerOne.participant.id,
                    playerTwoId = playerTwo?.participant?.id,
                    eventId = eventId,
                    roundId = roundId
            ))
            alreadyGrouped.add(playerOne.participant.id)
            if (playerTwo != null) alreadyGrouped.add(playerTwo.participant.id)
        }

        val findPairing = { player: ParticipantStats, group: Map.Entry<Int, List<ParticipantStats>>, allowRematch: Boolean, opponentIds: List<Long> ->
            group.value.find { it.participant.id != player.participant.id && (allowRematch || !opponentIds.contains(player.participant.id)) }
        }

        playersGrouped
                .forEach { group ->
                    group.value.forEach { player ->
                        if (!alreadyGrouped.contains(player.participant.id)) {
                            val opponent = findPairing(player, group, false, findOpponentIds(previousPairings, player.participant))
                            pairPlayers(player, opponent)
                        }
                    }
                }

        // naive groupings complete

        return naivePairings
    }

    private fun findOpponentIds(pairings: List<TournamentPairing>, player: TournamentParticipant): List<Long> {
        return pairings
                .filter { it.playerOneId == player.id || it.playerTwoId == player.id }
                .mapNotNull { if (it.playerOneId == player.id) it.playerTwoId else it.playerOneId }
    }

    private fun verifyTournamentAdmin(tourneyId: Long): KeyForgeEvent {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val tourney = keyForgeEventRepo.findByIdOrNull(tourneyId) ?: throw BadRequestException("No keyforge event with id $tourneyId")
        if (user.id != tourney.createdBy.id) {
            throw UnauthorizedException("Must be tournament organizer to perform admin functions.")
        }
        return tourney
    }

    private fun verifyTournamentAdminOrParticipant(participantUsername: String, tourneyId: Long): Triple<KeyUser, KeyUser, KeyForgeEvent> {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val participant = keyUserRepo.findByUsernameIgnoreCase(participantUsername) ?: throw BadRequestException("No user with username $participantUsername")
        val tourney = keyForgeEventRepo.findByIdOrNull(tourneyId) ?: throw BadRequestException("No tourney with id $tourneyId")

        if (user.id != participant.id && user.id != tourney.createdBy.id) {
            throw UnauthorizedException("Must be tournament organizer or participant to add/drop participant.")
        }
        return Triple(user, participant, tourney)
    }
}
