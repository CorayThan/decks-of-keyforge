package coraythan.keyswap.cards.cardwins

import coraythan.keyswap.expansions.Expansion
import java.util.*
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Id

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