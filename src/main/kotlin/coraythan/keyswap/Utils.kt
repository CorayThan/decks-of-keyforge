package coraythan.keyswap

fun String.tokenize(): List<String> {
    val trimmed = this
            .toLowerCase()
            .trim()
    val tokenized = trimmed
            .split("\\W+".toRegex())
            .filter { it.length > 2 }
    return if (tokenized.isEmpty()) listOf(trimmed) else tokenized
}
