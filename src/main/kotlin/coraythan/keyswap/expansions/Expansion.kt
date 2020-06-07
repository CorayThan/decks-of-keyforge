package coraythan.keyswap.expansions

enum class Expansion(val expansionNumber: Int, val readable: String) {
    CALL_OF_THE_ARCHONS(341, "CotA"),
    AGE_OF_ASCENSION(435, "AoA"),
    WORLDS_COLLIDE(452, "WC"),
    ANOMALY_EXPANSION(453, "AE"),
    MASS_MUTATION(479, "MM");

    companion object {
        fun forExpansionNumber(expansionNumber: Int?) = values().find { it.expansionNumber == expansionNumber }
                ?: throw IllegalStateException("No expansion for number $expansionNumber")
    }
}

val activeExpansions = setOf(Expansion.CALL_OF_THE_ARCHONS, Expansion.AGE_OF_ASCENSION, Expansion.WORLDS_COLLIDE, Expansion.MASS_MUTATION)
