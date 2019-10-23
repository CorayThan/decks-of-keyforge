package coraythan.keyswap.expansions

enum class Expansion(val expansionNumber: Int) {
    CALL_OF_THE_ARCHONS(341),
    AGE_OF_ASCENSION(435),
    WORLDS_COLLIDE(452);

    companion object {
        fun forExpansionNumber(expansionNumber: Int) = values().find { it.expansionNumber == expansionNumber }
                ?: throw IllegalStateException("No expansion for number $expansionNumber")
    }
}

val activeExpansions = setOf(Expansion.CALL_OF_THE_ARCHONS, Expansion.AGE_OF_ASCENSION, Expansion.WORLDS_COLLIDE)
