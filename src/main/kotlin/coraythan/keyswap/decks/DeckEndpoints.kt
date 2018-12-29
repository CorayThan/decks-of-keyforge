package coraythan.keyswap.decks

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/decks")
class DeckEndpoints(
        val deckService: DeckService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/public/filter")
    fun decks(@RequestBody deckFilters: DeckFilters): DecksPage {
        val decks = deckService.filterDecks(deckFilters)
        // log.info("Decks: $decks")
        return decks
    }

    @GetMapping("/public/{id}")
    fun findDeck(@PathVariable id: String) = deckService.findDeck(id)

    @GetMapping("/public/{id}/sale-info")
    fun findDeckSaleInfo(@PathVariable id: String) = deckService.saleInfoForDeck(id)
}
