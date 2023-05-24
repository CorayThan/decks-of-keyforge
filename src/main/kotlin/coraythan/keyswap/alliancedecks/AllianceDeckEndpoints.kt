package coraythan.keyswap.alliancedecks

import coraythan.keyswap.Api
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.models.DeckCount
import coraythan.keyswap.decks.models.DecksPage
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.system.measureTimeMillis

@RestController
@RequestMapping("${Api.base}/alliance-decks")
class AllianceDeckEndpoints(
    private val allianceDeckService: AllianceDeckService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/with-synergies/{id}")
    fun findAllianceDeck(@PathVariable id: UUID) = allianceDeckService.findAllianceDeckWithSynergies(id)

    @GetMapping("/search-result-with-cards/{id}")
    fun findAllianceDeckSearchResultWithCards(@PathVariable id: UUID) =
        allianceDeckService.findAllianceDeckSearchResultWithCards(id)

    @PostMapping("/filter")
    fun decks(
        @RequestBody deckFilters: AllianceDeckFilters,
        @RequestHeader(value = "Timezone") offsetMinutes: Int
    ): DecksPage {
        try {
            val cleanFilters = deckFilters.clean()

            if (cleanFilters.pageSize > 5000) {
                throw BadRequestException("Cannot request more than 5,000 alliance decks.")
            }

            var decks: DecksPage?
            val decksFilterTime = measureTimeMillis {
                decks = allianceDeckService.filterDecks(cleanFilters, offsetMinutes)
            }

            if (decksFilterTime > 500) log.warn("Alliance decks filtering took $decksFilterTime ms with filters $cleanFilters found ${decks?.decks?.size} decks")
            return decks!!
        } catch (ex: Exception) {
            throw RuntimeException("Couldn't filter alliance decks with filters $deckFilters", ex)
        }
    }

    @PostMapping("/filter-count")
    fun decksCount(@RequestBody deckFilters: AllianceDeckFilters): DeckCount {
        try {
            var decks: DeckCount?
            val cleanFilters = deckFilters.clean()
            val decksFilterTime = measureTimeMillis {
                decks = allianceDeckService.countFilters(cleanFilters)
            }

            if (decksFilterTime > 500) log.warn("Alliance decks counting took $decksFilterTime ms with filters $cleanFilters")
            return decks!!
        } catch (ex: Exception) {
            throw RuntimeException("Couldn't count alliance decks with filters $deckFilters", ex)
        }
    }

    @PostMapping("/secured")
    fun saveAlliance(@RequestBody deck: AllianceDeckHouses) = allianceDeckService.saveAllianceDeck(deck)

    @PostMapping("/secured/{id}/owned")
    fun owned(@PathVariable id: UUID) = allianceDeckService.addOwnedAllianceDeck(id)

    @PostMapping("/secured/{id}/unowned")
    fun unowned(@PathVariable id: UUID) = allianceDeckService.removeAllianceDeckOwnership(id)

    @GetMapping("/owned")
    fun findOwnedDecks() = allianceDeckService.findOwned()
}
