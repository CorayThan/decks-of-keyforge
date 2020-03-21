package coraythan.keyswap.decks.theoreticaldecks

import coraythan.keyswap.Api
import coraythan.keyswap.decks.models.SaveUnregisteredDeck
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/theoretical-decks")
class TheoreticalDeckEndpoints(
        private val theoreticalDeckService: TheoreticalDeckService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/{id}")
    fun find(@PathVariable id: UUID) = theoreticalDeckService.findTheoreticalDeck(id)

    @PostMapping
    fun save(@RequestBody deck: SaveUnregisteredDeck) = theoreticalDeckService.saveTheoreticalDeck(deck)
}
