package coraythan.keyswap.cards.cardwins

import coraythan.keyswap.expansions.Expansion
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import java.util.*

@Entity
data class CardWins(
        val cardName: String,
        @Enumerated(EnumType.STRING)
        val expansion: Expansion,
        val wins: Int = 0,
        val losses: Int = 0,
        @Id
        val id: UUID = UUID.randomUUID()
)