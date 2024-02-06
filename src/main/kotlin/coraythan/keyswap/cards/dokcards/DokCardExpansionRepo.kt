package coraythan.keyswap.cards.dokcards

import coraythan.keyswap.expansions.Expansion
import org.springframework.data.jpa.repository.JpaRepository

interface DokCardExpansionRepo : JpaRepository<DokCardExpansion, Long> {
    fun findByExpansionAndCardNumber(expansion: Expansion, cardNumber: String): DokCardExpansion?
}
