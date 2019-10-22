package coraythan.keyswap.thirdpartyservices

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.cards.KeyforgeCard
import coraythan.keyswap.decks.models.KeyforgeDeck
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate
import kotlin.system.measureTimeMillis

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeDecksPageDto(
        val count: Int,
        val data: List<KeyforgeDeck>
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeDeckLinks(
        val houses: List<String>?,
        val cards: List<String>?
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeDeckLinksFullCards(
        val houses: Set<KeyforgeHouse>?,
        val cards: List<KeyforgeCard>?
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeDeckDto(
        val data: KeyforgeDeck,
        val _linked: KeyforgeDeckLinksFullCards
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeHouse(
        val id: String,
        val name: String,
        val image: String
)

const val keyforgeApiDeckPageSize = 10

@Service
class KeyforgeApi(
        val restTemplate: RestTemplate
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    /**
     * Null implies no decks available.
     */
    fun findDecks(page: Int, ordering: String = "date", pageSize: Int = keyforgeApiDeckPageSize): KeyforgeDecksPageDto? {
        var decks: KeyforgeDecksPageDto? = null

        val keyforgeRequestDuration = measureTimeMillis {
            decks = keyforgeGetRequest(
                    KeyforgeDecksPageDto::class.java,
                    "decks/?page=$page&page_size=$pageSize&search=&powerLevel=0,11&chains=0,24&ordering=$ordering"
            )
        }
        log.debug("Getting $pageSize decks from keyforge api took $keyforgeRequestDuration got decks ${decks?.count}")
        return decks
    }

    fun findDeck(deckId: String, withCards: Boolean = true): KeyforgeDeckDto? {
        return keyforgeGetRequest(
                KeyforgeDeckDto::class.java,
                "decks/$deckId${if (withCards) "/?links=cards" else ""}"
        )
    }

    private fun <T> keyforgeGetRequest(returnType: Class<T>, url: String): T? {
        try {
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
        } catch (e: HttpClientErrorException.NotFound) {
            // No results
            return null
        }
    }
}