package coraythan.keyswap.expansions

import coraythan.keyswap.House

enum class Expansion(val expansionNumber: Int, val readable: String, val houses: Set<House>) {
    CALL_OF_THE_ARCHONS(341, "CotA", setOf(House.Brobnar, House.Dis, House.Logos, House.Mars, House.Sanctum, House.Shadows, House.Untamed)),
    AGE_OF_ASCENSION(435, "AoA", setOf(House.Brobnar, House.Dis, House.Logos, House.Mars, House.Sanctum, House.Shadows, House.Untamed)),
    WORLDS_COLLIDE(452, "WC", setOf(House.Brobnar, House.Dis, House.Logos, House.StarAlliance, House.Saurian, House.Shadows, House.Untamed)),
    ANOMALY_EXPANSION(453, "AE", setOf()),
    MASS_MUTATION(479, "MM", setOf(House.StarAlliance, House.Dis, House.Logos, House.Saurian, House.Sanctum, House.Shadows, House.Untamed));

    companion object {
        fun forExpansionNumber(expansionNumber: Int?) = values().find { it.expansionNumber == expansionNumber }
                ?: throw IllegalStateException("No expansion for number $expansionNumber")
    }
}

val activeExpansions = setOf(Expansion.CALL_OF_THE_ARCHONS, Expansion.AGE_OF_ASCENSION, Expansion.WORLDS_COLLIDE, Expansion.MASS_MUTATION)
