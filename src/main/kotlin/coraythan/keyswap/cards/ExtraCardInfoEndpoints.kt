package coraythan.keyswap.cards

import coraythan.keyswap.Api
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/extra-card-infos")
class ExtraCardInfoEndpoints(
    private val extraCardInfoService: ExtraCardInfoService,
    private val cardService: CardService,
) {

    @GetMapping("/{infoId}")
    fun findInfo(@PathVariable infoId: UUID) = extraCardInfoService.findExtraCardInfo(infoId)

    @PostMapping("/secured")
    fun saveInfo(@RequestBody extraCardInfo: ExtraCardInfo): UUID {
        val id = extraCardInfoService.updateExtraCardInfo(extraCardInfo)

        GlobalScope.launch {
            cardService.loadExtraInfo()
            cardService.reloadCachedCards()
        }

        return id
    }
}
