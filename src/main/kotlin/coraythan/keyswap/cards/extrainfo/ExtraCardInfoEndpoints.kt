package coraythan.keyswap.cards.extrainfo

import coraythan.keyswap.Api
import coraythan.keyswap.cards.*
import coraythan.keyswap.cards.dokcards.DokCardCacheService
import coraythan.keyswap.cards.FrontendCard
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/extra-card-infos")
class ExtraCardInfoEndpoints(
    private val extraCardInfoService: ExtraCardInfoService,
    private val cardCache: DokCardCacheService,
) {

    @GetMapping("/{infoId}")
    fun findInfo(@PathVariable infoId: UUID) = extraCardInfoService.findExtraCardInfo(infoId)

    @PostMapping("/secured")
    fun saveInfo(@RequestBody extraCardInfo: ExtraCardInfo): UUID {
        val id = extraCardInfoService.updateExtraCardInfo(extraCardInfo)

        GlobalScope.launch {
            cardCache.loadCards()
        }

        return id
    }

    @GetMapping("/historical/{cardName}")
    fun cardAercHistory(@PathVariable cardName: String): CardHistory {
        val card = cardCache.findByCardName(cardName)
        val publishedAERCsForCard = extraCardInfoService.publishedAERCs(cardName)
        val editHistory = extraCardInfoService.editHistoryForCard(publishedAERCsForCard.map { it.id })
        return CardHistory(
            card.toCardForFrontend(),
            publishedAERCsForCard,
            editHistory,
        )
    }

    @GetMapping("/edit-history/{extraInfoId}")
    fun editHistory(@PathVariable extraInfoId: UUID, @RequestHeader(value = "Timezone") offsetMinutes: Int): List<AercBlame> {
        return extraCardInfoService.editHistoryForCardById(extraInfoId, offsetMinutes)
    }
}

data class CardHistory(
    val card: FrontendCard,
    val cardAERCs: List<ExtraCardInfo>,
    val editHistory: List<CardEditHistory>,
)
