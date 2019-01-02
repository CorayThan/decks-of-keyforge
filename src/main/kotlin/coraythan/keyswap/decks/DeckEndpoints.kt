package coraythan.keyswap.decks

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import kotlin.system.measureTimeMillis

@RestController
@RequestMapping("${Api.base}/decks")
class DeckEndpoints(
        val deckService: DeckService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/public/filter")
    fun decks(@RequestBody deckFilters: DeckFilters): DecksPage {
        var decks = DecksPage(listOf(), 0, 0)
        val decksFilterTime = measureTimeMillis {
            decks = deckService.filterDecks(deckFilters)
        }

        log.info("Decks filtering took $decksFilterTime ms with filters $deckFilters")
        return decks
    }

    @GetMapping("/public/{id}")
    fun findDeck(@PathVariable id: String) = deckService.findDeckWithSynergies(id)

    @GetMapping("/public/{id}/sale-info")
    fun findDeckSaleInfo(@PathVariable id: String) = deckService.saleInfoForDeck(id)
}
