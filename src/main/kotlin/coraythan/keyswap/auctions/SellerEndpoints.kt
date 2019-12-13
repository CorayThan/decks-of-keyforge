package coraythan.keyswap.auctions

import coraythan.keyswap.Api
import coraythan.keyswap.userdeck.UpdatePrice
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/sellers/secured")
class SellerEndpoints(
        val sellerService: SellerService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/update-prices")
    fun updatePrices(@RequestBody prices: List<UpdatePrice>) = sellerService.updatePrices(prices)

}
