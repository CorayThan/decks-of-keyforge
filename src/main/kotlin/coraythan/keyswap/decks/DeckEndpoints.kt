package coraythan.keyswap.decks

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
}
