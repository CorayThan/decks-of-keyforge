package coraythan.keyswap.decks.theoreticaldecks

import coraythan.keyswap.Api
import coraythan.keyswap.alliancedecks.AllianceDeckHouses
import coraythan.keyswap.decks.models.DeckBuildingData
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/theoretical-decks")
class TheoreticalDeckEndpoints(
    private val theoreticalDeckService: TheoreticalDeckService
) {

    @GetMapping("/secured/mine")
    fun findMyTheoreticalDecks() = theoreticalDeckService.findMyTheoreticalDecks(false)

    @GetMapping("/secured/alliance/mine")
    fun findMyAllianceDecks() = theoreticalDeckService.findMyTheoreticalDecks(true)

    @GetMapping("/{id}")
    fun find(@PathVariable id: UUID) = theoreticalDeckService.findTheoreticalDeck(id)

    @PostMapping("/secured")
    fun save(@RequestBody deck: DeckBuildingData) = theoreticalDeckService.saveTheoreticalDeck(deck)

    @PostMapping("/secured/alliance")
    fun saveAlliance(@RequestBody deck: AllianceDeckHouses) = theoreticalDeckService.saveAllianceDeck(deck)

    @PostMapping("/secured/delete/{id}")
    fun deleteTheoreticalDeck(@PathVariable id: UUID) = theoreticalDeckService.deleteTheoreticalDeck(id)
}
