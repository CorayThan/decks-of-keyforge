package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*
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
        @ManyToOne(cascade = [CascadeType.ALL])
        var info: ExtraCardInfo? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {
    fun toNumberSetPair() = CardNumberSetPair(expansion, cardNumber)

    override fun toString(): String {
        return "CardIdentifier(expansion=$expansion, cardNumber='$cardNumber', id=$id, extraInfoId=${info?.id})"
    }

}

interface CardIdentifierRepo : JpaRepository<CardIdentifier, UUID>, QuerydslPredicateExecutor<CardIdentifier> {
    fun findByExpansionAndCardNumber(expansion: Expansion, cardNumber: String): List<CardIdentifier>
    fun existsByExpansionAndCardNumber(expansion: Expansion, cardNumber: String): Boolean
    fun countByExpansion(expansion: Expansion): Long
}
