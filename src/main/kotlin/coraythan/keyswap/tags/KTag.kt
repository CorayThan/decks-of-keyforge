package coraythan.keyswap.tags

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class KTag(
        val name: String,

        @JsonIgnoreProperties("tags")
        @ManyToOne
        val creator: KeyUser,

        @Enumerated(EnumType.STRING)
        val publicityType: PublicityType = PublicityType.PUBLIC,

        val publicEdits: Boolean = false,

        @JsonIgnoreProperties("tag")
        @OneToMany(mappedBy = "tag", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
        val decks: List<DeckTag> = listOf(),

        val archived: Boolean = false,

        val views: Int = 0,
        val viewsThisMonth: Int = 0,

        val created: LocalDateTime = nowLocal(),
        val lastSeen: LocalDateTime = nowLocal(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {
        fun toDto(quantity: Int? = null) = TagDto(
                name,
                creator.username,
                publicityType,
                views,
                viewsThisMonth,
                created,
                archived,
                id,
                quantity
        )
}

@GenerateTs
enum class PublicityType {
        PUBLIC,
        NOT_SEARCHABLE,
        PRIVATE
}
