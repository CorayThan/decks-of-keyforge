package coraythan.keyswap.decks

import coraythan.keyswap.Api
import coraythan.keyswap.cards.publishedAercVersion
import coraythan.keyswap.decks.models.*
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
        private val deckSearchService: DeckSearchService,
        private val deckImporterService: DeckImporterService,
        private val azureOcr: AzureOcr,
        private val userDeckService: UserDeckService,
        private val deckWinsService: DeckWinsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/by-name/{name}")
    fun findDecksByName(@PathVariable name: String) = deckSearchService.findDecksByName(name)

    @PostMapping("/filter")
    fun decks(@RequestBody deckFilters: DeckFilters, @RequestHeader(value = "Timezone") offsetMinutes: Int): DecksPage {
        try {
            val cleanFilters = deckFilters.clean()
            var decks: DecksPage? = null
            val decksFilterTime = measureTimeMillis {
                decks = deckSearchService.filterDecks(cleanFilters, offsetMinutes)
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
                decks = deckSearchService.countFilters(cleanFilters)
            }

            if (decksFilterTime > 500) log.warn("Decks counting took $decksFilterTime ms with filters $cleanFilters")
            return decks!!
        } catch (ex: Exception) {
            throw RuntimeException("Couldn't count decks with filters $deckFilters", ex)
        }
    }

    @GetMapping("/random")
    fun randomDeckId() = deckSearchService.randomDeckId()

    @GetMapping("/{id}/simple")
    fun findDeckSimple(@PathVariable id: String) = "Please update to the new version."

    @GetMapping("/simple/v2/{id}")
    fun findDeckSimple2(@PathVariable id: String) = "Please update to the new version."

    @GetMapping("/with-synergies/{id}")
    fun findDeck(@PathVariable id: String) = deckSearchService.findDeckWithSynergies(id)

    @GetMapping("/search-result-with-cards/{id}")
    fun findDeckSearchResultWithCards(@PathVariable id: String) = deckSearchService.findDeckSearchResultWithCards(id)

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
        return deckSearchService.saleInfoForDeck(id, offsetMinutes)
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
    fun updating() = !doneRatingDecks

    @GetMapping("/update-crucible-tracker-wins")
    fun updateCrucibleTrackerWins() = deckWinsService.updateCrucibleTrackerWinsAndLosses()

    @PostMapping("/secured/{id}/refresh-deck-scores")
    fun refreshDeckScores(@PathVariable id: String) = deckWinsService.updateSingleDeck(id)

//    @PostMapping("/add-cards-for-expansion/{expansionId}/{cardsInExpansion}")
//    fun addCardsForExpansion(@PathVariable expansionId: Int, @PathVariable cardsInExpansion: Int) = deckImporterService.addCardsForExpansion(expansionId, cardsInExpansion)

    @PostMapping("/view-theoretical")
    fun viewTheoretical(@RequestBody deck: SaveUnregisteredDeck): DeckWithSynergyInfo {
        return deckImporterService.viewTheoreticalDeck(deck)
    }
}

data class SimpleDeckResponse(
        val deck: Any,
        val sasVersion: Int = publishedAercVersion
)

class Nothing()
