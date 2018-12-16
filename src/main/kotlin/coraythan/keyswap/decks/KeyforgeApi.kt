package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

data class KeyforgeDecksPageDto(
        val count: Int,
        val data: List<Deck>
)

data class KeyforgeDeckLinks(
        val houses: Set<House>?,
        val cards: List<String>?
)

data class KeyforgeDeckLinksFullCards(
        val houses: Set<KeyforgeHouse>?,
        val cards: List<Card>?
)

data class KeyforgeDeckDto(
        val data: Deck,
        val _linked: KeyforgeDeckLinksFullCards
)

data class KeyforgeHouse(
        val id: String,
        val name: String,
        val image: String
)

@Service
class KeyforgeApi(
        val restTemplate: RestTemplate
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun findDecks(page: Int, pageSize: Int = 25): KeyforgeDecksPageDto? {
        if (page < 1) {
            throw IllegalArgumentException("Page has to be greater than 1.")
        } else if (pageSize < 1 || pageSize > 25) {
            throw IllegalArgumentException("Page size has to be greater than 1 and less than 26.")
        }
        val decks = keyforgeGetRequest(
                KeyforgeDecksPageDto::class.java,
                "decks/?page=$page&page_size=$pageSize&search=&power_level=0,11&chains=0,24&ordering=date"
        )
        // log.info("Found decks from api: $decks")
        return decks
    }

    fun findDeck(deckId: String, withCards: Boolean = true): KeyforgeDeckDto? {
        return keyforgeGetRequest(
                KeyforgeDeckDto::class.java,
                "decks/$deckId${if (withCards) "/?links=cards" else ""}"
        )
    }

    private fun <T> keyforgeGetRequest(returnType: Class<T>, url: String): T? {
        val decksEntity = restTemplate.exchange(
                "https://www.keyforgegame.com/api/$url",
                HttpMethod.GET,
                HttpEntity<Any?>(null, HttpHeaders().let {
                    it.set("cache-control", "no-cache")
                    it.set("user-agent", "SpringBootRequest")
                    it
                }),
                returnType)
        return decksEntity.body
    }
}