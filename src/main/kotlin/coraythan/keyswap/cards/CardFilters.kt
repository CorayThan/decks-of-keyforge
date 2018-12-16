package coraythan.keyswap.cards

import coraythan.keyswap.House

data class CardFilters(
        val includeMavericks: Boolean = false,
        val rarities: Set<Rarity>? = null,
        val types: Set<CardType>? = null,
        val houses: Set<House>? = null,
        val title: String? = null,
        val amberMax: Int? = null,
        val amberMin: Int? = null,
        val powerMax: Int? = null,
        val powerMin: Int? = null,
        val armorMax: Int? = null,
        val armorMin: Int? = null
)