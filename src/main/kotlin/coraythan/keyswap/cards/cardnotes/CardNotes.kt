package coraythan.keyswap.cards.cardnotes

import com.fasterxml.jackson.annotation.JsonIgnore
import coraythan.keyswap.cards.dokcards.DokCard
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.now
import coraythan.keyswap.users.KeyUser
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import java.time.ZonedDateTime
import java.util.*

@Entity
data class CardNotes(

    val note: String = "",

    @JsonIgnore
    @ManyToOne
    val card: DokCard,

    @JsonIgnore
    @ManyToOne
    val user: KeyUser,

    val approved: Boolean = false,

    val extraInfoVersion: Int,

    val created: ZonedDateTime = now(),
    val updated: ZonedDateTime? = null,

    @Id
    val id: UUID = UUID.randomUUID()
) {
    fun toDto() = CardNotesDto(
        note = note,
        cardId = card.id,
        username = user.username,
        approved = approved,
        extraInfoVersion = extraInfoVersion,
        created = created,
        updated = updated,
        id = id,
    )
}

@GenerateTs
data class CardNotesDto(
    val note: String,
    val cardId: Long,
    val username: String?,
    val approved: Boolean,
    val extraInfoVersion: Int,
    val created: ZonedDateTime?,
    val updated: ZonedDateTime?,
    val id: UUID?,
)
