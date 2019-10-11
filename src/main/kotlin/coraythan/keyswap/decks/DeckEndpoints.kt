package coraythan.keyswap.decks

import coraythan.keyswap.Api
import coraythan.keyswap.decks.models.DeckCount
import coraythan.keyswap.decks.models.DeckSaleInfo
import coraythan.keyswap.decks.models.DecksPage
import coraythan.keyswap.decks.models.SaveUnregisteredDeck
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.thirdpartyservices.AzureOcr
import coraythan.keyswap.userdeck.UserDeckService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import kotlin.system.measureTimeMillis

@RestController
@RequestMapping("${Api.base}/decks")
class DeckEndpoints(
        private val deckService: DeckService,
        private val deckImporterService: DeckImporterService,
        private val azureOcr: AzureOcr,
        private val userDeckService: UserDeckService,
        private val deckWinsService: DeckWinsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/by-name/{name}")
    fun findDecksByName(@PathVariable name: String) = deckService.findDecksByName(name)

    @PostMapping("/filter")
    fun decks(@RequestBody deckFilters: DeckFilters, @RequestHeader(value = "Timezone") offsetMinutes: Int): DecksPage {
        try {
            val cleanFilters = deckFilters.clean()
            var decks: DecksPage? = null
            val decksFilterTime = measureTimeMillis {
                decks = deckService.filterDecks(cleanFilters, offsetMinutes)
            }

            if (decksFilterTime > 500) log.warn("Decks filtering took $decksFilterTime ms with filters $cleanFilters")
            return decks!!
        } catch (ex: Exception) {
            throw RuntimeException("Couldn't filter decks with filters $deckFilters", ex)
        }

    }

    @PostMapping("/filter-count")
    fun decksCount(@RequestBody deckFilters: DeckFilters): DeckCount {
        try {
            var decks: DeckCount? = null
            val cleanFilters = deckFilters.clean()
            val decksFilterTime = measureTimeMillis {
                decks = deckService.countFilters(cleanFilters)
            }

            if (decksFilterTime > 500) log.warn("Decks counting took $decksFilterTime ms with filters $cleanFilters")
            return decks!!
        } catch (ex: Exception) {
            throw RuntimeException("Couldn't count decks with filters $deckFilters", ex)
        }
    }

    @GetMapping("/random")
    fun randomDeckId() = deckService.randomDeckId()

    @GetMapping("/{id}/simple")
    fun findDeckSimple(@PathVariable id: String) = "Please update to the new version."

    @GetMapping("/simple/v2/{id}")
    fun findDeckSimple2(@PathVariable id: String) = "Please update to the new version."

    @GetMapping("/with-synergies/{id}")
    fun findDeck(@PathVariable id: String) = deckService.findDeckWithSynergies(id)

    @GetMapping("/search-result-with-cards/{id}")
    fun findDeckSearchResultWithCards(@PathVariable id: String) = deckService.findDeckSearchResultWithCards(id)

    @PostMapping("/{id}/import")
    fun importDeck(@PathVariable id: String) = deckImporterService.importDeck(id) != null

    @PostMapping("/{id}/import-and-add")
    fun importDeckAndAddToMyDecks(@PathVariable id: String): Boolean {
        val imported = deckImporterService.importDeck(id)
        if (imported != null) userDeckService.markAsOwned(imported, true)
        return imported != null
    }

    @GetMapping("/{id}/sale-info")
    fun findDeckSaleInfo(@PathVariable id: String, @RequestHeader(value = "Timezone") offsetMinutes: Int): List<DeckSaleInfo> {
        return deckService.saleInfoForDeck(id, offsetMinutes)
    }

    @PostMapping("/secured/read-deck-image/{expansion}")
    fun readDeckImage(@RequestParam("deckImage") deckImage: MultipartFile, @PathVariable expansion: Expansion): SaveUnregisteredDeck? {
        return azureOcr.readDeckInfoFromImage(deckImage, expansion)
    }

    @PostMapping("/secured/add-unregistered")
    fun addUnregistered(@RequestBody deck: SaveUnregisteredDeck): String {
        return deckImporterService.addUnregisteredDeck(deck)
    }

    @GetMapping("/updating")
    fun updating() = deckImporterService.doneRatingDecks == false

    @GetMapping("/update-crucible-tracker-wins")
    fun updateCrucibleTrackerWins() = deckWinsService.updateCrucibleTrackerWinsAndLosses()
}

data class SimpleDeckResponse(
        val deck: Any,
        val sasVersion: Int = currentDeckRatingVersion
)

class Nothing()
