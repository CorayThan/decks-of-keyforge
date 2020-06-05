package coraythan.keyswap

import java.math.RoundingMode
import java.security.MessageDigest

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

fun Any.makeChecksum(): String {
    val json = KeyswapApplication.objectMapper.writeValueAsBytes(this)
    val digest = MessageDigest.getInstance("SHA-512")
    val hash = digest.digest(json)
    val hexString = StringBuilder()
    for (aMessageDigest: Byte in hash) {
        var h = Integer.toHexString(0xFF and aMessageDigest.toInt())
        while (h.length < 2) {
            h = "0$h"
        }
        hexString.append(h)
    }
    return hexString.toString()
}
