package coraythan.keyswap.expansions

import coraythan.keyswap.House
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
enum class Expansion(val expansionNumber: Int, val readable: String, val houses: Set<House>) {
    CALL_OF_THE_ARCHONS(341, "CotA", setOf(House.Brobnar, House.Dis, House.Logos, House.Mars, House.Sanctum, House.Shadows, House.Untamed)),
    AGE_OF_ASCENSION(435, "AoA", setOf(House.Brobnar, House.Dis, House.Logos, House.Mars, House.Sanctum, House.Shadows, House.Untamed)),
    WORLDS_COLLIDE(452, "WC", setOf(House.Brobnar, House.Dis, House.Logos, House.StarAlliance, House.Saurian, House.Shadows, House.Untamed)),
    ANOMALY_EXPANSION(453, "AE", setOf()),
    MASS_MUTATION(479, "MM", setOf(House.StarAlliance, House.Dis, House.Logos, House.Saurian, House.Sanctum, House.Shadows, House.Untamed)),
    DARK_TIDINGS(496, "DT", setOf(House.StarAlliance, House.Unfathomable, House.Logos, House.Saurian, House.Sanctum, House.Shadows, House.Untamed)),
    WINDS_OF_EXCHANGE(600, "WoE", setOf(House.Brobnar, House.Ekwidon, House.Mars, House.Saurian, House.Sanctum, House.StarAlliance, House.Unfathomable)),
    UNCHAINED_2022(601, "UC22", House.values().toSet());

    companion object {
        fun forExpansionNumber(expansionNumber: Int?) = values().find { it.expansionNumber == expansionNumber }
                ?: throw IllegalStateException("No expansion for number $expansionNumber")

        fun realExpansionValues() = values().filter { it != ANOMALY_EXPANSION }
    }

}

val activeExpansions = setOf(
        Expansion.CALL_OF_THE_ARCHONS,
        Expansion.AGE_OF_ASCENSION,
        Expansion.WORLDS_COLLIDE,
        Expansion.MASS_MUTATION,
        Expansion.DARK_TIDINGS,
        Expansion.WINDS_OF_EXCHANGE,
        Expansion.UNCHAINED_2022,
)
