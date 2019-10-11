package coraythan.keyswap.expansions

enum class Expansion(val expansionNumber: Int) {
    CALL_OF_THE_ARCHONS(341),
    AGE_OF_ASCENSION(435),
    WORLDS_COLLIDE(1);

    companion object {
        fun forExpansionNumber(expansionNumber: Int) = Expansion.values().find { it.expansionNumber == expansionNumber }!!
    }
}
