package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import javax.persistence.*

data class CardIds(
        val cardIds: Map<House, List<CardNumberSetPairOld>>
) {
    companion object {
        fun fromCards(cards: List<Card>): CardIds {
            if (cards.size != 36) throw IllegalArgumentException("Cards for card ids must be 36")
            return CardIds(cards.groupBy { it.house }.mapValues { it.value.map { CardNumberSetPairOld(it.expansion, it.cardNumber) } })
        }
    }
}

data class CardNumberSetPair(
        val expansion: Expansion,
        val cardNumber: String
)

@Entity
data class CardIdentifier(

        @Enumerated(EnumType.STRING)
        val expansion: Expansion,

        val cardNumber: String,

        // Should never be null in DB
        @JsonIgnoreProperties("cardNumbers")
        @ManyToOne
        val info: ExtraCardInfo? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {
    fun toNumberSetPair() = CardNumberSetPair(expansion, cardNumber)
}

interface CardIdentifierRepo : JpaRepository<CardIdentifier, Long>, QuerydslPredicateExecutor<CardIdentifier> {
    fun findByExpansionAndCardNumber(expansion: Expansion, cardNumber: String): List<CardIdentifier>
}
