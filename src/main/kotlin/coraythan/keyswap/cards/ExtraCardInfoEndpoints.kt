package coraythan.keyswap.cards

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/extra-card-infos")
class ExtraCardInfoEndpoints(
        private val extraCardInfoService: ExtraCardInfoService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/{infoId}")
    fun findSpoiler(@PathVariable infoId: Long) = extraCardInfoService.findExtraCardInfo(infoId)

    @PostMapping("/secured")
    fun saveSpoiler(@RequestBody extraCardInfo: ExtraCardInfo) = extraCardInfoService.updateExtraCardInfo(extraCardInfo)
}
