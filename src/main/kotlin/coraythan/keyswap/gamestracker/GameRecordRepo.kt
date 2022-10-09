package coraythan.keyswap.gamestracker

import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*

interface GameRecordRepo : CrudRepository<GameRecord, Long> {

    fun findByPlayerOneAndPlayerOneDeckIdAndPlayerTwoAndPlayerTwoDeckIdAndReportDateTimeAfter(
        playerOne: String,
        playerOneDeckId: String,
        playerTwo: String,
        playerTwoDeckId: String,
        reportDateAfter: LocalDateTime
    ): List<GameRecord>

    fun findByPlayerOneOrPlayerTwo(
        playerOne: String,
        playerTwo: String,
    ): List<GameRecord>

    fun findByPlayerOneDeckIdOrPlayerTwoDeckId(
        playerOneDeckId: String,
        playerTwoDeckId: String
    ): List<GameRecord>
}
