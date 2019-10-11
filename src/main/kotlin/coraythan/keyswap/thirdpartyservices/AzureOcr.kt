package coraythan.keyswap.thirdpartyservices

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardNumberSetPairOld
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.models.SaveUnregisteredDeck
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import org.springframework.web.multipart.MultipartFile

@Service
class AzureOcr(
        @Value("\${azure-ocr-key}")
        private val azureOcrKey: String,
        private val restTemplate: RestTemplate,
        private val cardService: CardService
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val numberRegex = "\\d+".toRegex()

    fun readDeckInfoFromImage(deckImage: MultipartFile, expansion: Int): SaveUnregisteredDeck? {
        val response: ResponseEntity<OcrResults> = restTemplate.exchange(
                "https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr",
                HttpMethod.POST,
                HttpEntity(
                        LinkedMultiValueMap<String, Any>()
                                .apply { this.add("file", deckImage.resource) },
                        HttpHeaders().let {
                            it.contentType = MediaType.MULTIPART_FORM_DATA
                            it.set("Ocp-Apim-Subscription-Key", azureOcrKey)
                            it
                        }
                )
        )
        val results = response.body ?: return null

        val ocrLines = results.regions.flatMap { it.lines }
        val topLine = ocrLines.filter { it.top() != null }.minBy { it.top()!! }
        val deckName = topLine?.words?.joinToString(" ") { it.text } ?: "Unrecognized Deck Name"

        val lines = ocrLines.map { line -> line.words.map { it.text } }
        log.info("Deck read lines $lines")
        if (lines.size < 19) return null
        val cardsByName: Map<String, Card> = cardService.allFullCardsNonMaverick()
                .filter { it.expansion == expansion }
                .map { it.cardTitle to it }.toMap()

        var cards: MutableMap<House, MutableList<Card>> = mutableMapOf()

        var houseCount = 0
        val lineResults = lines
                .mapIndexed { index, line ->
                    if (line.size == 1 && House.valueOfOrNull(line[0]) != null) {
                        houseCount++
                        LineResult(house = House.valueOf(line[0]), idx = index)
                    } else {
                        val card = findCardFromWords(line, expansion, cardsByName)
                        if (card != null) {
                            LineResult(card = card, idx = index)
                        } else {
                            null
                        }
                    }
                }
                .mapNotNull { it }

        if (houseCount == 3) {
            var currentHouse: House? = null
            lineResults.forEach {
                if (it.house != null) {
                    currentHouse = it.house
                    cards[it.house] = mutableListOf()
                } else {
                    val house = currentHouse
                    if (it.card != null && house != null) {
                        val card = if (it.card.house != house) it.card.copy(maverick = true, house = house) else it.card
                        cards[currentHouse!!]!!.add(card)
                    }
                }
            }
        } else {
            val cardsLists: MutableMap<House, MutableList<Card>> = lineResults
                    .mapNotNull { it.card }
                    .groupBy { it.house }
                    .filter { it.value.size > 5 }
                    .mapValues { it.value.toMutableList() }
                    .toMutableMap()
            cards = cardsLists
        }

        if (cards.keys.size != 3 || cards.values.any { it.size < 4 }) {
            return null
        }

        return SaveUnregisteredDeck(
                name = if (deckName == "DECK LIST") "Unrecognized Deck Name" else deckName,
                cards = cards
        )
    }

    private fun findCardFromWords(words: List<String>, expansion: Int, cardsByName: Map<String, Card>): Card? {
        if (words.isEmpty()) {
            return null
        } else {
            val firstWord = words[0]
            val secondWord = words.getOrNull(1)
            val numberString = if (firstWord.length > 2) firstWord else secondWord

            var cardNumber = numberString?.takeLast(3)

            if (cardNumber == null && numberString != null) {
                val realNumber = numberRegex.find(numberString)?.value
                cardNumber = realNumber?.takeLast(3)

            }

            val foundCard = if (cardNumber == null) null else cardService.allFullCardsNonMaverickMap()[CardNumberSetPairOld(
                    expansion, cardNumber
            )]

            return if (foundCard != null) {
                foundCard
            } else {
                val cardName = if (words.size > 1) words.subList(1, words.size).joinToString(separator = " ") else null
                cardsByName[cardName]
            }
        }
    }
}

private data class OcrResults(
        val regions: List<OcrRegion>
)

private data class OcrRegion(
        val lines: List<OcrLine>
)

private data class OcrLine(
        val words: List<OcrWord>,
        val boundingBox: String
) {
    fun top() = boundingBox.split(",").getOrNull(1)?.toIntOrNull()
}

private data class OcrWord(
        val text: String
)

private data class LineResult(
        val house: House? = null,
        val card: Card? = null,
        val idx: Int
)
