package coraythan.keyswap

import java.math.RoundingMode

fun String.tokenize(): List<String> {
    val trimmed = this
            .toLowerCase()
            .trim()
    val tokenized = trimmed
            .split("\\W+".toRegex())
            .filter { it.length > 2 }
    return if (tokenized.isEmpty()) listOf(trimmed) else tokenized
}

fun Double.roundToOneSigDig() = this.toBigDecimal().setScale(1, RoundingMode.HALF_UP).toDouble()
fun Double.roundToTwoSigDig() = this.toBigDecimal().setScale(2, RoundingMode.HALF_UP).toDouble()

val capFinder = "(?=\\p{Upper})".toRegex()

fun String.startCase(): String {
    return this.split(capFinder).joinToString(" ") { it.capitalize() }
}
