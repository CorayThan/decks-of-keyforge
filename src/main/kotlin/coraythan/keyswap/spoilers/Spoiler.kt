package coraythan.keyswap.spoilers

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import javax.persistence.*


@Entity
data class Spoiler(
        val cardTitle: String,
        @Enumerated(EnumType.STRING)
        val house: House,
        @Enumerated(EnumType.STRING)
        val cardType: CardType,
        val frontImage: String?,
        val cardText: String,
        val amber: Int,
        val powerString: String,
        val armorString: String,
        @Enumerated(EnumType.STRING)
        val rarity: Rarity,
        val cardNumber: String,
        val expansion: Int,

        val active: Boolean = true,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

enum class SpoilerExpansion {
    WORLDS_COLLIDE
}
