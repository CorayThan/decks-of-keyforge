package coraythan.keyswap.config

enum class Env(val baseUrl: String) {
    dev("http://localhost:3000"),
    qa("https://decks-of-keyforge-qa-2.us-west-2.elasticbeanstalk.com"),
    prod("https://decksofkeyforge.com")
}
