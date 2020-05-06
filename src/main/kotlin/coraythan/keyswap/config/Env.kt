package coraythan.keyswap.config

enum class Env(val baseUrl: String) {
    dev("http://localhost:3000"),
    qa("http://nathanwestlake.com"),
    prod("https://decksofkeyforge.com")
}
