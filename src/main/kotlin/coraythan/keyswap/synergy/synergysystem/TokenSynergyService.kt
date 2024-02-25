package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.House
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.TraitStrength

object TokenSynergyService {

    fun makeTokenValues(cards: List<DokCardInDeck>, token: DokCardInDeck?): TokenValues? {
        if (token == null) return null

        val cardsByHouse: Map<House, List<DokCardInDeck>> = cards.groupBy { it.house }
        val traitsByHouse: Map<House, List<SynTraitValue>> = cardsByHouse.map { cardsByHouseEntry ->
            cardsByHouseEntry.key to cardsByHouseEntry.value.map { it.extraCardInfo.traits }.flatten()
        }.toMap()
        val makesTokenStrengthsByHouse: Map<House, Double> =
            traitsByHouse.map { it.key to it.value.sumOf { traitToTokenCreationValue(it) } }.toMap()

        return TokenValues(
            tokensPerGamePerHouse = makesTokenStrengthsByHouse,
            tokenHouse = token.house,
        )
    }

    private fun traitToTokenCreationValue(trait: SynTraitValue): Double {
        return if (trait.trait != SynergyTrait.makesTokens) {
            0.0
        } else {
            when (trait.strength()) {
                TraitStrength.EXTRA_WEAK -> 1.0
                TraitStrength.WEAK -> 1.5
                TraitStrength.NORMAL -> 2.0
                TraitStrength.STRONG -> 3.0
                TraitStrength.EXTRA_STRONG -> 4.0
            }
        }
    }
}

data class TokenValues(
    val tokensPerGamePerHouse: Map<House, Double>,
    val tokenHouse: House,
) {
    val tokensPerGame get() = this.tokensPerGamePerHouse.values.sum()
    val inHouseTokensPerGame get() = this.tokensPerGamePerHouse[tokenHouse]
    val outOfHouseTokensPerGame get() = this.tokensPerGamePerHouse.filter { it.key != tokenHouse }.values.sum()
}
