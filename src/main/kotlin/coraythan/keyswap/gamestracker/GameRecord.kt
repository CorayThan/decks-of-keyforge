package coraythan.keyswap.gamestracker

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.nowLocal
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class GameRecord(
    val playerOne: String,
    val playerOneDeckId: String,
    val playerTwo: String,
    val playerTwoDeckId: String,

    @OneToMany(
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL,],
        orphanRemoval = true,
    )
    @JoinColumn(name = "recordId")
    @OrderBy("eventNumber")
    val gameEvents: List<GameEvent>,

    val winner: String?,

    val reportDateTime: LocalDateTime = nowLocal(),

    @Id
    val id: UUID = UUID.randomUUID(),
) {
    fun toDto(timeOffset: Int) = GameRecordDto(
        playerOne = playerOne,
        playerOneDeckId = playerOneDeckId,
        playerTwo = playerTwo,
        playerTwoDeckId = playerTwoDeckId,
        gameEvents = gameEvents.map { it.message },
        winner = winner,
        reportDate = reportDateTime.toReadableStringWithOffsetMinutes(timeOffset),
        id = id,
    )

    fun winningDeck(): String? {
        return when (winner) {
            playerOne -> playerOneDeckId
            playerTwo -> playerTwoDeckId
            else -> null
        }
    }
}

@Entity
data class GameEvent(

    val message: String,

    val recordId: UUID,

    val eventNumber: Int,

    @Id
    val id: UUID = UUID.randomUUID()
)

data class GameReport(
    val playerOne: String,
    val playerOneDeckId: String,
    val playerTwo: String,
    val playerTwoDeckId: String,
    val messages: List<String>,
)

@GenerateTs
data class GameRecordDto(
    val playerOne: String,
    val playerOneDeckId: String,
    val playerTwo: String,
    val playerTwoDeckId: String,
    val gameEvents: List<String>,
    val reportDate: String,
    val winner: String?,
    val id: UUID = UUID.randomUUID(),
)

