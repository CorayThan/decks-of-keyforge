package coraythan.keyswap.decks

import coraythan.keyswap.Api
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.collectionstats.CollectionStats
import coraythan.keyswap.decks.compare.DeckCompareService
import coraythan.keyswap.decks.compare.DecksToCompareDto
import coraythan.keyswap.decks.models.DeckCount
import coraythan.keyswap.decks.models.DeckSaleInfo
import coraythan.keyswap.decks.models.DecksPage
import coraythan.keyswap.decks.models.doneRatingDecks
import coraythan.keyswap.decks.pastsas.PastSasService
import coraythan.keyswap.userdeck.UserDeckService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import kotlin.system.measureTimeMillis

@RestController
@RequestMapping("${Api.base}/decks")
class DeckEndpoints(
        private val deckSearchService: DeckSearchService,
        private val deckImporterService: DeckImporterService,
        private val userDeckService: UserDeckService,
        private val deckWinsService: DeckWinsService,
        private val pastSasService: PastSasService,
        private val deckCompareService: DeckCompareService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/by-name/{name}")
    fun findDecksByName(@PathVariable name: String) = deckSearchService.findDecksByName(name)

    @PostMapping("/filter")
    fun decks(@RequestBody deckFilters: DeckFilters, @RequestHeader(value = "Timezone") offsetMinutes: Int): DecksPage {
        try {
            val cleanFilters = deckFilters.clean()

            if (cleanFilters.pageSize > 5000) {
                throw BadRequestException("Cannot request more than 5,000 decks.")
            }

            var decks: DecksPage?
            val decksFilterTime = measureTimeMillis {
                decks = deckSearchService.filterDecks(cleanFilters, offsetMinutes)
            }

            if (decksFilterTime > 500) log.warn("Decks filtering took $decksFilterTime ms with filters $cleanFilters found ${decks?.decks?.size} decks")
            return decks!!
        } catch (ex: Exception) {
            throw RuntimeException("Couldn't filter decks with filters $deckFilters", ex)
        }
    }

    @PostMapping("/compare")
    fun compareDecks(@RequestBody decks: DecksToCompareDto) = deckCompareService.compareDecks(decks)

    @PostMapping("/filter-count")
    fun decksCount(@RequestBody deckFilters: DeckFilters): DeckCount {
        try {
            var decks: DeckCount?
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

    @PostMapping("/stats")
    fun decksStats(@RequestBody deckFilters: DeckFilters, @RequestHeader(value = "Timezone") offsetMinutes: Int): CollectionStats {
        val decks = decks(deckFilters, offsetMinutes)
        return CollectionStats.makeStats(decks.decks)
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

    @GetMapping("/updating")
    fun updating() = !doneRatingDecks

    @PostMapping("/secured/{id}/refresh-deck-scores")
    fun refreshDeckScores(@PathVariable id: String) = deckWinsService.updateSingleDeck(id)

    @GetMapping("/past-sas/{id}")
    fun findPastSas(@PathVariable id: Long) = pastSasService.findByDeckId(id)
}

data class SimpleDeckResponse(
        val deck: Any,
        val sasVersion: Int
)

class Nothing()
