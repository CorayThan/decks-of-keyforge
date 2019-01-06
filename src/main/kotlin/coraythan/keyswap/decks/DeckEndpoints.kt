package coraythan.keyswap.decks

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import kotlin.system.measureTimeMillis

@RestController
@RequestMapping("${Api.base}/decks")
class DeckEndpoints(
        val deckService: DeckService,
        val deckImporterService: DeckImporterService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/filter")
    fun decks(@RequestBody deckFilters: DeckFilters): DecksPage {
        var decks = DecksPage(listOf(), 0, 0)
        val decksFilterTime = measureTimeMillis {
            decks = deckService.filterDecks(deckFilters)
        }

        log.info("Decks filtering took $decksFilterTime ms with filters $deckFilters")
        return decks
    }

    @GetMapping("/{id}")
    fun findDeck(@PathVariable id: String) = deckService.findDeckWithSynergies(id)

    @PostMapping("/{id}/import")
    fun importDeck(@PathVariable id: String) = deckImporterService.importDeck(id)

    @GetMapping("/{id}/sale-info")
    fun findDeckSaleInfo(@PathVariable id: String) = deckService.saleInfoForDeck(id)
}
