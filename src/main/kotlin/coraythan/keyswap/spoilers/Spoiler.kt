package coraythan.keyswap.spoilers

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import java.util.*
import javax.persistence.*


@Entity
data class Spoiler(
        val cardTitle: String,
        @Enumerated(EnumType.STRING)
        val house: House?,
        @Enumerated(EnumType.STRING)
        val cardType: CardType,
        val frontImage: String?,
        val cardText: String,
        val amber: Int,
        val powerString: String,
        val armorString: String,
        @Enumerated(EnumType.STRING)
        val rarity: Rarity?,
        val cardNumber: String?,
        val expansion: Int,
        val anomaly: Boolean = false,
        val reprint: Boolean = false,
        val doubleCard: Boolean = false,

        val traitsString: String?,

        val createdById: UUID,

        val active: Boolean = true,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {

    val traits: List<String>
            get() {
                return traitsString?.split(",") ?: listOf()
            }
}
