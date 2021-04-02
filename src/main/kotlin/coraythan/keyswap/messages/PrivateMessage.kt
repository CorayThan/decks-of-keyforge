package coraythan.keyswap.messages

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.SimpleDeckSearchResult
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class PrivateMessage(
        val toId: UUID,
        val fromId: UUID,

        val subject: String,
        val message: String,
        val sent: LocalDateTime = nowLocal(),
        val viewed: LocalDateTime? = null,
        val replied: LocalDateTime? = null,

        @JsonIgnoreProperties("replies")
        @ManyToOne
        val replyTo: PrivateMessage? = null,

        @JsonIgnoreProperties("replyTo")
        @OneToMany(mappedBy = "replyTo", fetch = FetchType.LAZY)
        val replies: List<PrivateMessage> = listOf(),

        @ManyToOne
        val deck: Deck? = null,

        val recipientHidden: Boolean = false,
        val senderHidden: Boolean = false,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "message_id_sequence")
        val id: Long = -1,
) {
    fun toDto(user: KeyUser, otherUser: KeyUser): PrivateMessageDto {
        val replyDtos = replies
                .map { it.toDto(user, otherUser) }
                .sortedBy { it.sent }
        val toMe = user.id == toId
        return PrivateMessageDto(
                id = id,
                toId = toId,
                toUsername = if (toMe) user.username else otherUser.username,
                fromId = fromId,
                fromUsername = if (toMe) otherUser.username else user.username,
                subject = subject,
                message = message,
                sent = sent,
                viewed = viewed,
                replied = replied,
                replyToId = replyTo?.id,
                deck = if (deck == null) null else SimpleDeckSearchResult(
                        name = deck.name,
                        keyforgeId = deck.keyforgeId,
                        houses = deck.houses,
                        sas = deck.sasRating,
                ),
                hidden = if (toId == user.id) recipientHidden else senderHidden,
                replies = replyDtos,
                fullyViewed = (viewed != null || toId != user.id) && replies.all { it.viewed != null || toId != user.id }
        )
    }
}

interface PrivateMessageRepo : CrudRepository<PrivateMessage, Long> {
    fun countByToIdAndViewedIsNullAndRecipientHiddenIsFalse(toId: UUID): Long
    fun findByReplyToId(replyToId: Long): List<PrivateMessage>
}
