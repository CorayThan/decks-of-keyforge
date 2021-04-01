package coraythan.keyswap.messages

import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.SimpleDeckSearchResult
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class PrivateMessage(
        @ManyToOne
        val to: KeyUser,
        @ManyToOne
        val from: KeyUser,
        val subject: String,
        val message: String,
        val sent: LocalDateTime = nowLocal(),
        val viewed: LocalDateTime? = null,
        val replied: LocalDateTime? = null,

        val replyToId: Long? = null,

        @ManyToOne
        val deck: Deck? = null,

        val recipientHidden: Boolean = false,
        val senderHidden: Boolean = false,

        @Id
        val id: Long = -1,
) {
        fun toDto() = PrivateMessageDto(
                toId = to.id,
                toUsername = to.username,
                fromId = from.id,
                fromUsername = from.username,
                subject = subject,
                message = message,
                sent = sent,
                viewed = viewed,
                replied = replied,
                replyToId = replyToId,
                deck = if (deck == null) null else SimpleDeckSearchResult(
                        name = deck.name,
                        keyforgeId = deck.keyforgeId,
                        houses = deck.houses,
                        sas = deck.sasRating,
                )

        )
}

interface PrivateMessageRepo : CrudRepository<PrivateMessage, Long> {
        fun countByToIdAndViewedFalse(toId: UUID): Long
}
