package coraythan.keyswap.gamestracker

import coraythan.keyswap.nowLocal
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

//@Transactional
//@Service
//class GameTrackerService(
//    private val gameRecordRepo: GameRecordRepo
//) {
//
//    private val log = LoggerFactory.getLogger(this::class.java)
//
//    fun saveGame(gameRecord: GameRecordDto) {
//
//        val possibleDupes =
//            gameRecordRepo.findByPlayerOneAndPlayerOneDeckIdAndPlayerTwoAndPlayerTwoDeckIdAndReportDateTimeAfter(
//                gameRecord.playerOne,
//                gameRecord.playerOneDeckId,
//                gameRecord.playerTwo,
//                gameRecord.playerTwoDeckId,
//                nowLocal().minusHours(36)
//            )
//
//        val dupe = possibleDupes.any { possibleDupe ->
//            gameRecord.gameEvents == possibleDupe.gameEvents.map { it.message }
//        }
//
//        if (!dupe) {
//            val gameRecordId = UUID.randomUUID()
//            val toSave = GameRecord(
//                playerOne = gameRecord.playerOne,
//                playerOneDeckId = gameRecord.playerOneDeckId,
//                playerTwo = gameRecord.playerTwo,
//                playerTwoDeckId = gameRecord.playerTwoDeckId,
//                gameEvents = gameRecord.gameEvents.mapIndexed { index, eventMessage -> GameEvent(eventMessage, gameRecordId, index) },
//                winner = gameRecord.winner,
//                id = gameRecordId
//            )
//
//            gameRecordRepo.save(toSave)
//        }
//    }
//
//    fun findGames(filter: GamesSearchFilters): GamesSet {
//
//        val games = listOf<GameRecord>()
//
//        return GamesSet(
//            won = games.count {
//                (filter.tcoPlayerName == null || it.winner == filter.tcoPlayerName)
//                filter.deckId == null || it.winningDeck() == filter.deckId
//            },
//            lost = 0,
//            avgOpponentSas = 70,
//            avgTurnsToWin = 0,
//            avgTurnsToLose = 0,
//            vsSets = listOf(),
//            gamesList = listOf()
//        )
//    }
//
//}
