package coraythan.keyswap.config

enum class Env(val baseUrl: String) {
    dev("http://localhost:3000"),
    prod("https://decksofkeyforge.com")
}
