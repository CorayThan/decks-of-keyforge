package coraythan.keyswap.cards

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/cards")
class CardEndpoints(
        val cardService: CardService,
        val cardRepo: CardRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/filter")
    fun cards(@RequestBody cardFilters: CardFilters): Iterable<Card> {
        log.debug("In cards filter with filters $cardFilters")
        return cardService.filterCards(cardFilters)
    }
}