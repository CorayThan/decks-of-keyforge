package coraythan.keyswap.cards

import coraythan.keyswap.Api
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

    @PostMapping("/filter")
    fun cards(@RequestBody cardFilters: CardFilters) = cardService.filterCards(cardFilters)
}