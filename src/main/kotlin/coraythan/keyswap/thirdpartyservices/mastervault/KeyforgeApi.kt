package coraythan.keyswap.thirdpartyservices.mastervault

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.config.Env
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate

data class KeyForgeDeckResponse(
    val deck: KeyForgeDeckDto? = null,
    val error: String? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeDecksPageDto(
    val count: Int,
    val data: List<KeyForgeDeck>,
    val _linked: KeyForgeDeckLinksFullCards

)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeDeckLinks(
        val houses: List<String>?,
        val cards: List<String>?
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeDeckLinksFullCards(
    val houses: Set<KeyForgeHouse>?,
    val cards: List<KeyForgeCard>?
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeDeckDto(
    val data: KeyForgeDeck,
    val _linked: KeyForgeDeckLinksFullCards
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeHouse(
        val id: String,
        val name: String,
        val image: String
)

const val keyforgeApiDeckPageSize = 10

@Service
class KeyforgeApi(
        private val restTemplate: RestTemplate,
        @Value("\${env}")
        private val env: Env
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val mvProxyBaseUrl = "http://mvproxy.us-west-2.elasticbeanstalk.com/api/master-vault"

    /**
     * Null implies no decks available.
     */
    fun findDecks(page: Int, ordering: String = "date", pageSize: Int = keyforgeApiDeckPageSize, expansion: Int? = null, useMasterVault: Boolean = false, withCards: Boolean = false): KeyForgeDecksPageDto? {
        return if (useMasterVault || env == Env.dev) {
            keyforgeGetRequest(
                    KeyForgeDecksPageDto::class.java,
                    "decks/?page=$page&page_size=$pageSize&search=&powerLevel=0,11&chains=0,24&ordering=$ordering" +
                            (if (expansion == null) "" else "&expansion=$expansion") +
                            (if (withCards) "&links=cards" else "")
            )
        } else {
            restTemplate.postForObject(
//                    "http://localhost:5001/api/master-vault/decks",
                    "$mvProxyBaseUrl/decks",
                    HttpEntity<KeyForgeDeckRequestFilters>(KeyForgeDeckRequestFilters(page, ordering, pageSize, expansion, withCards)),
                    KeyForgeDecksPageDto::class.java
            )
        }
    }

    fun findDeckToImport(deckId: String): KeyForgeDeckResponse? {
        return if (env == Env.dev) {
            KeyForgeDeckResponse(
                keyforgeGetRequest(
                    KeyForgeDeckDto::class.java,
                    "decks/$deckId/?links=cards"
                )
            )
        } else {
            restTemplate.getForObject(
                "$mvProxyBaseUrl/decks/$deckId",
                KeyForgeDeckResponse::class.java
            )
        }
    }

    fun findDeck(deckId: String, withCards: Boolean = true): KeyForgeDeckDto? {
        return keyforgeGetRequest(
                KeyForgeDeckDto::class.java,
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

data class KeyForgeDeckRequestFilters(
        val page: Int,
        // "date", "-wins", "-losses"
        val ordering: String,
        val pageSize: Int,
        val expansion: Int?,
        val withCards: Boolean,
)
