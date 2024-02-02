package coraythan.keyswap.cards

import coraythan.keyswap.Api
import coraythan.keyswap.cards.dokcards.DokCardCacheService
import coraythan.keyswap.users.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/cards")
class CardEndpoints(
    private val cardCache: DokCardCacheService,
    private val currentUserService: CurrentUserService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun allCards() = cardCache.currentCards()

    @GetMapping("/historical")
    fun findHistoricalInfo() = cardCache.previousCards()

    @GetMapping("/future")
    fun findFutureInfo() = cardCache.futureCards()

    @GetMapping("/reload")
    fun reloadCards() {
        currentUserService.adminOrUnauthorized()
        cardCache.loadCards()
    }
}
