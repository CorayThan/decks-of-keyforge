package coraythan.keyswap.decks.ownership

import coraythan.keyswap.thirdpartyservices.S3Service
import coraythan.keyswap.users.KeyUser
import java.time.LocalDate
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class DeckOwnership(
        val deckId: Long,

        @ManyToOne
        val user: KeyUser,

        val key: String,

        val uploadDateTime: LocalDateTime = LocalDateTime.now(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {
    val uploadDate: LocalDate
        get() = uploadDateTime.toLocalDate()

    fun toDto() = DeckOwnershipDto(
            deckId = deckId,
            username = user.username,
            url = S3Service.userContentUrl(key),
            uploadDate = uploadDate,
            id = id
    )
}

data class DeckOwnershipDto(
        val deckId: Long,
        val username: String,
        val uploadDate: LocalDate,
        val url: String,
        val id: Long
)
