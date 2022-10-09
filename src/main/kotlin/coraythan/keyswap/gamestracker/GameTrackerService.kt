package coraythan.keyswap.gamestracker

import coraythan.keyswap.TimeUtils
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.firstWord
import coraythan.keyswap.nowLocal
import coraythan.keyswap.teams.TeamRepo
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.users.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
@Service
class GameTrackerService(
    private val gameRecordRepo: GameRecordRepo,
    private val currentUserService: CurrentUserService,
    private val teamRepo: TeamRepo,
    private val deckSearchService: DeckSearchService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private val gameWinnerRegex = ".* has won the game".toRegex()

    fun saveGame(gameRecord: GameReport) {

        val possibleDupes =
            gameRecordRepo.findByPlayerOneAndPlayerOneDeckIdAndPlayerTwoAndPlayerTwoDeckIdAndReportDateTimeAfter(
                gameRecord.playerOne,
                gameRecord.playerOneDeckId,
                gameRecord.playerTwo,
                gameRecord.playerTwoDeckId,
                nowLocal().minusHours(36)
            )

        val dupe = possibleDupes.any { possibleDupe ->
            gameRecord.messages == possibleDupe.gameEvents.map { it.message }
        }

        if (dupe) log.info("Not recording dupe game")
        if (!dupe) {
            log.info("Recording non-dupe game")
            val gameRecordId = UUID.randomUUID()

            val winnerMessage = gameRecord.messages.find { it.matches(gameWinnerRegex) }
            val gameWinner = winnerMessage?.firstWord()

            val toSave = GameRecord(
                playerOne = gameRecord.playerOne,
                playerOneDeckId = gameRecord.playerOneDeckId,
                playerTwo = gameRecord.playerTwo,
                playerTwoDeckId = gameRecord.playerTwoDeckId,
                gameEvents = gameRecord.messages.mapIndexed { index, eventMessage ->
                    GameEvent(
                        eventMessage,
                        gameRecordId,
                        index
                    )
                },
                winner = gameWinner,
                id = gameRecordId
            )

            gameRecordRepo.save(toSave)
        }
    }

    fun searchGames(filter: GamesSearchFilters, offsetMinutes: Int): GamesSet {
        val userTeamId = currentUserService.loggedInUserOrUnauthorized().teamId
        if (userTeamId != null) {
            val teamForUser = teamRepo.findByIdOrNull(userTeamId)
            if (teamForUser?.name != "Team SAS of the Luxurious Playstyle") throw UnauthorizedException("You do not have permission to search games on DoK.")
        }
        val games = if (filter.tcoPlayerName != null) {
            gameRecordRepo.findByPlayerOneOrPlayerTwo(filter.tcoPlayerName, filter.tcoPlayerName)
        } else if (filter.deckId != null) {
            gameRecordRepo.findByPlayerOneDeckIdOrPlayerTwoDeckId(filter.deckId, filter.deckId)
        } else {
            throw BadRequestException("Must include player or deck in search games request.")
        }

        val won = games.count {
            (filter.tcoPlayerName == null || it.winner == filter.tcoPlayerName)
            filter.deckId == null || it.winningDeck() == filter.deckId
        }
        val lost = games.count() - won

        return GamesSet(
            won = won,
            lost = lost,
            avgOpponentSas = 70,
            avgTurnsToWin = 0,
            avgTurnsToLose = 0,
            vsSets = listOf(),
            gamesList = games.map {
                MiniGameRecord(
                    playerOne = it.playerOne,
                    playerOneDeck = deckSearchService.findDeckSimple(it.playerOneDeckId),
                    playerTwo = it.playerTwo,
                    playerTwoDeck = deckSearchService.findDeckSimple(it.playerTwoDeckId),
                    turns = 99,
                    winner = it.winner ?: "???",
                    reportDayTime = it.reportDateTime.toReadableStringWithOffsetMinutes(
                        offsetMinutes,
                        TimeUtils.localDateTimeFormatter
                    ),
                    logs = it.gameEvents.map { it.message }
                )
            }
        )
    }

}
