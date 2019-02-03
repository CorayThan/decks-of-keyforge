package coraythan.keyswap.decks

import coraythan.keyswap.Api
import coraythan.keyswap.thirdpartyservices.AzureOcr
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import kotlin.system.measureTimeMillis

@RestController
@RequestMapping("${Api.base}/decks")
class DeckEndpoints(
        val deckService: DeckService,
        val deckImporterService: DeckImporterService,
        val azureOcr: AzureOcr
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/filter")
    fun decks(@RequestBody deckFilters: DeckFilters): DecksPage {
        var decks: DecksPage? = null
        val decksFilterTime = measureTimeMillis {
            decks = deckService.filterDecks(deckFilters)
        }

        if (decksFilterTime > 500) log.warn("Decks filtering took $decksFilterTime ms with filters $deckFilters")
        return decks!!
    }

    @PostMapping("/filter-count")
    fun decksCount(@RequestBody deckFilters: DeckFilters): DeckCount {
        var decks: DeckCount? = null
        val decksFilterTime = measureTimeMillis {
            decks = deckService.countFilters(deckFilters)
        }

        if (decksFilterTime > 500) log.warn("Decks counting took $decksFilterTime ms with filters $deckFilters")
        return decks!!
    }

    @CrossOrigin
    @GetMapping("/{id}/simple")
    fun findDeckSimple(@PathVariable id: String) = deckService.findDeckSimple(id)

    @GetMapping("/{id}")
    fun findDeck(@PathVariable id: String) = deckService.findDeckWithSynergies(id)

    @PostMapping("/{id}/import")
    fun importDeck(@PathVariable id: String) = deckImporterService.importDeck(id)

    @GetMapping("/{id}/sale-info")
    fun findDeckSaleInfo(@PathVariable id: String) = deckService.saleInfoForDeck(id)

    @PostMapping("/secured/read-deck-image")
    fun readDeckImage(@RequestParam("deckImage") deckImage: MultipartFile): SaveUnregisteredDeck? {
        return azureOcr.readDeckInfoFromImage(deckImage)
    }

    @PostMapping("/secured/add-unregistered")
    fun addUnregistered(@RequestBody deck: SaveUnregisteredDeck): String {
        return deckImporterService.addUnregisteredDeck(deck)
    }
}
