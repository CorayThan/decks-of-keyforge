package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.synergy.*
import org.slf4j.LoggerFactory


data class MatchSynergiesToTraits(
    val traitValues: MutableList<SynTraitValueWithHouse> = mutableListOf()
) {

    companion object {
        private val log = LoggerFactory.getLogger(this::class.java)
    }

    fun matches(card: DokCardInDeck, synergyValue: SynTraitValue): SynMatchInfo {
        val house = card.house
        val cardName = card.card.cardTitle

        // log.info("Check if there is a match for card ${card.cardTitle} in trait values ${ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(traitValues)}")

        val matchedTraits = traitValues
            .filter {
                val extraCardInfo = it.card?.extraCardInfo
                val traitsCard = it.card?.card
                val typeMatch =
                    typesMatch(
                        traitTrait = it.value.trait,
                        synTypes = synergyValue.cardTypes ?: listOf(),
                        cardTypes = extraCardInfo?.allCardTypes(),
                        traitTypes = it.value.cardTypes ?: listOf(),
                    )
                val playerMatch = playersMatch(synergyValue.player, it.value.player)
                val houseMatch = housesMatch(synergyValue.house, house, it.value.house, it.house, it.deckTrait)

                // If the synergy has a power range, does the traits card match that power range?
                val synergyPowerMatch = synergyValue.powerMatch(traitsCard?.power ?: -1, traitsCard?.cardType)
                // If the trait has a power range, does the synergizing card match that power range?
                val traitPowerMatch = it.value.powerMatch(card.card.power, card.card.cardType)

                // For matching traits on the synergy
                val synergyTraitsMatch =
                    traitsOnSynergyMatch(
                        synergyValue.cardTraits ?: listOf(),
                        traitsCard?.traits,
                        synergyValue.notCardTraits
                    )
                // For matching traits on the trait
                val traitsTraitMatch = traitsOnTraitMatch(
                    synergyTraits = it.value.cardTraits ?: listOf(),
                    cardTraits = card.card.traits,
                    nonMatchOnly = it.value.notCardTraits
                )
                val match =
                    typeMatch && playerMatch && houseMatch && synergyPowerMatch && traitPowerMatch && synergyTraitsMatch && traitsTraitMatch

                // log.debug("\ntrait ${synergyValue.trait} match $match\n ${it.value.trait} in ${it.card?.cardTitle ?: "Deck trait: ${it.deckTrait}"} \ntype $typeMatch player $playerMatch house $houseMatch power $powerMatch trait $traitMatch")

                match
            }

        var sameCard = false
        val cardNames = matchedTraits.mapNotNull {
            if (it.card?.card?.cardTitle == cardName) {
                sameCard = true
            }
            it.card?.card?.cardTitle
        }
        val strength = matchedTraits
            .groupBy { it.value.strength() }
            .map {
                it.key to if (sameCard && it.value.any { it.card?.card?.cardTitle != null && it.card.card.cardTitle == cardName }) it.value.count() - 1 else it.value.count()
            }
            .toMap()
        return SynMatchInfo(strength, cardNames)
    }

    private fun typesMatch(
        traitTrait: SynergyTrait,
        synTypes: List<CardType>,
        cardTypes: Set<CardType>?,
        traitTypes: List<CardType>
    ): Boolean {
        return if (traitTrait == SynergyTrait.any) {
            synTypes.isEmpty() || synTypes.any { cardTypes?.contains(it) ?: false }
        } else {
            synTypes.isEmpty() || traitTypes.isEmpty() || synTypes.any { type1Type -> traitTypes.any { type1Type == it } }
        }
    }

    private fun playersMatch(player1: SynTraitPlayer, player2: SynTraitPlayer): Boolean {
        return player1 == SynTraitPlayer.ANY || player2 == SynTraitPlayer.ANY || player1 == player2
    }

    private fun traitsOnSynergyMatch(
        synergyTraits: Collection<String>,
        cardTraits: Collection<String>?,
        nonMatchOnly: Boolean
    ): Boolean {
        // log.info("In traits match syn traits $synergyTraits cardTraits $cardTraits")
        return synergyTraits.isEmpty() || (cardTraits != null && synergyTraits.all {
            val hasMatch = cardTraits.contains(it)
            if (nonMatchOnly) !hasMatch else hasMatch
        })
    }

    private fun traitsOnTraitMatch(
        synergyTraits: Collection<String>,
        cardTraits: Collection<String>?,
        nonMatchOnly: Boolean
    ): Boolean {
        // log.info("In traits match syn traits $synergyTraits cardTraits $cardTraits")
        return synergyTraits.isEmpty() || (cardTraits != null && synergyTraits.all {
            val hasMatch = cardTraits.contains(it)
            if (nonMatchOnly) !hasMatch else hasMatch
        })
    }

    private fun housesMatch(
        synHouse: SynTraitHouse,
        house1: House,
        traitHouse: SynTraitHouse,
        house2: House?,
        deckTrait: Boolean = false
    ): Boolean {
        return when (synHouse) {
            SynTraitHouse.anyHouse -> when (traitHouse) {
                // any house with any house always true
                SynTraitHouse.anyHouse -> true
                SynTraitHouse.house -> !deckTrait && house1 == house2
                SynTraitHouse.outOfHouse -> !deckTrait && house1 != house2
                SynTraitHouse.continuous -> true
            }

            SynTraitHouse.house -> when (traitHouse) {
                SynTraitHouse.anyHouse -> !deckTrait && house1 == house2
                SynTraitHouse.house -> house1 == house2
                // out of house with in house always false
                SynTraitHouse.outOfHouse -> false
                SynTraitHouse.continuous -> true
            }

            SynTraitHouse.outOfHouse -> when (traitHouse) {
                SynTraitHouse.anyHouse -> !deckTrait && house1 != house2
                // out of house with in house always false
                SynTraitHouse.house -> false
                SynTraitHouse.outOfHouse -> house1 != house2
                SynTraitHouse.continuous -> true
            }
            // Synergies with omni always match
            SynTraitHouse.continuous -> true
        }
    }

}

fun MutableMap<SynergyTrait, MatchSynergiesToTraits>.addTrait(
    traitValue: SynTraitValue,
    card: DokCardInDeck?,
    house: House?,
    deckTrait: Boolean = false
) {
    if (!this.containsKey(traitValue.trait)) {
        this[traitValue.trait] = MatchSynergiesToTraits()
    }
    this[traitValue.trait]!!.traitValues.add(SynTraitValueWithHouse(traitValue, card, house, deckTrait))
}

fun MutableMap<SynergyTrait, MatchSynergiesToTraits>.addDeckTrait(
    trait: SynergyTrait,
    count: Int,
    house: House? = null,
    traitHouse: SynTraitHouse = SynTraitHouse.anyHouse,
    strength: TraitStrength = TraitStrength.NORMAL
) {
    repeat(count) {
        this.addTrait(SynTraitValue(trait, strength.value, traitHouse), null, house, true)
    }
}

data class SynMatchInfo(
    var matches: Map<TraitStrength, Int>,
    var cardNames: List<String> = listOf()
)

data class SynTraitValueWithHouse(
    val value: SynTraitValue,
    val card: DokCardInDeck?,
    val house: House?,
    val deckTrait: Boolean
)

