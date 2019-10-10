package coraythan.keyswap.cards

import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import javax.persistence.*

data class CardIds(
        val cardIds: Map<House, List<CardNumberSetPair>>
) {
    companion object {
        fun fromCards(cards: List<Card>): CardIds {
            if (cards.size != 36) throw IllegalArgumentException("Cards for card ids must be 36")
            return CardIds(cards.groupBy { it.house }.mapValues { it.value.map { CardNumberSetPair(it.expansion, it.cardNumber.toInt()) } })
        }
    }
}

data class CardNumberSetPair(
        val expansion: Int,
        // Leave this as an Int for now because 0 padding sucks
        val cardNumber: Int
)

@Entity
data class CardIdentifier(

        @Enumerated(EnumType.STRING)
        val expansion: Expansion,

        val cardNumber: String,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

interface CardIdentifierRepo : JpaRepository<CardIdentifier, Long>, QuerydslPredicateExecutor<CardIdentifier>

