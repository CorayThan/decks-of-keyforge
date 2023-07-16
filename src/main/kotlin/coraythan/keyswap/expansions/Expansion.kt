package coraythan.keyswap.expansions

import coraythan.keyswap.House
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
enum class Expansion(val expansionNumbers: List<Int>, val readable: String, val houses: Set<House>, val hasTokens: Boolean) {
    CALL_OF_THE_ARCHONS(listOf(341), "CotA", setOf(House.Brobnar, House.Dis, House.Logos, House.Mars, House.Sanctum, House.Shadows, House.Untamed), false),
    AGE_OF_ASCENSION(listOf(435), "AoA", setOf(House.Brobnar, House.Dis, House.Logos, House.Mars, House.Sanctum, House.Shadows, House.Untamed), false),
    WORLDS_COLLIDE(listOf(452), "WC", setOf(House.Brobnar, House.Dis, House.Logos, House.StarAlliance, House.Saurian, House.Shadows, House.Untamed), false),
    ANOMALY_EXPANSION(listOf(453), "AE", setOf(), false),
    MASS_MUTATION(listOf(479), "MM", setOf(House.StarAlliance, House.Dis, House.Logos, House.Saurian, House.Sanctum, House.Shadows, House.Untamed), false),
    DARK_TIDINGS(listOf(496), "DT", setOf(House.StarAlliance, House.Unfathomable, House.Logos, House.Saurian, House.Sanctum, House.Shadows, House.Untamed), false),
    WINDS_OF_EXCHANGE(listOf(600), "WoE", setOf(House.Brobnar, House.Ekwidon, House.Mars, House.Saurian, House.Sanctum, House.StarAlliance, House.Unfathomable), true),
    UNCHAINED_2022(listOf(601), "UC22", House.values().toSet(), true);

    companion object {
        fun forExpansionNumber(expansionNumber: Int?) = values().find { it.expansionNumbers.contains(expansionNumber) }
                ?: throw IllegalStateException("No expansion for number $expansionNumber")

        fun realExpansionValues() = values().filter { it != ANOMALY_EXPANSION }
        fun expansionsWithTokens() = values().filter { it.hasTokens }
    }

    val primaryExpansion: Int
        get() = this.expansionNumbers.first()

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
