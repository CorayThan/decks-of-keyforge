package coraythan.keyswap.cards

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import kotlin.system.measureTimeMillis

@RestController
@RequestMapping("${Api.base}/cards")
class CardEndpoints(
        private val cardService: CardService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/filter")
    fun cards(@RequestBody cardFilters: CardFilters): Iterable<Card> {
        var cards: Iterable<Card> = listOf()
        val cardFilterTime = measureTimeMillis {
            cards = cardService.filterCards(cardFilters)
        }
            log.info("Filtering cards took $cardFilterTime with filters $cardFilters")
        return cards
    }

    @GetMapping
    fun allCards() = cardService.allFullCardsNonMaverickNoDups()

    @GetMapping("/complete")
    fun realAllCards() = cardService.realAllCards()

    @GetMapping("/historical")
    fun findHistoricalInfo() = cardService.previousInfo()

    @GetMapping("/future")
    fun findFutureInfo() = cardService.nextInfo()

    @PostMapping("/convert-spoilers")
    fun convertSpoilers() = cardService.convertSpoilers()
}
