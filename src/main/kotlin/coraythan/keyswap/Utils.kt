package coraythan.keyswap

import java.math.RoundingMode

fun String.tokenize(): List<String> {
    val trimmed = this
            .lowercase()
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
    return this.split(capFinder).joinToString(" ") { it.replaceFirstChar { cap -> cap.uppercase() } }
}

fun Int?.zeroToNull(): Int? {
    if (this == 0) return null
    return this
}

fun Double?.zeroToNull(): Double? {
    if (this == 0.0) return null
    return this
}

fun String?.emptyToNull(): String? {
    if (this.isNullOrBlank()) return null
    return this
}

fun Boolean?.falseToNull(): Boolean? {
    if (this == false) return null
    return this
}

fun String.htmlEncode(): String {
    return this
            .replace("\"", "&quot;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("&", "&amp;")
            .replace("'", "&#39;")
}
