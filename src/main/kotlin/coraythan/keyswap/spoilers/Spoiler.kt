package coraythan.keyswap.spoilers

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import javax.persistence.*
import kotlin.math.roundToInt


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
        val rarity: Rarity,
        val cardNumber: String,
        val expansion: Int,
        val anomaly: Boolean = false,
        val reprint: Boolean = false,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val efficiency: Double = 0.0,
        val effectivePower: Int = 0,
        val disruption: Double = 0.0,
        val amberProtection: Double = 0.0,
        val houseCheating: Double = 0.0,
        val other: Double = 0.0,

        val active: Boolean = true,
//
//        @OneToOne
//        val info: ExtraCardInfo? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {
    val aercScore: Double
        get() {
            return (
                    this.amberControl +
                            this.expectedAmber +
                            this.artifactControl +
                            this.creatureControl +
                            this.efficiency +
                            this.disruption +
                            this.houseCheating +
                            this.amberProtection +
                            this.other +
                            (if (this.cardType == CardType.Creature) 0.4 else 0.0) +
                            (((this.effectivePower.toDouble() / 10) * 10).roundToInt().toDouble() / 10)
                    )
        }
}
