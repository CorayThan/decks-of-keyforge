package coraythan.keyswap.sellers

import coraythan.keyswap.Api
import coraythan.keyswap.userdeck.UpdatePrice
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/sellers")
class SellersEndpoints(
        private val sellerService: SellerService
) {

    @PostMapping("/secured/update-prices")
    fun updatePrices(@RequestBody prices: List<UpdatePrice>) = sellerService.updatePrices(prices)

    @GetMapping("/featured")
    fun featuredSellers(@RequestHeader(value="Timezone") offsetMinutes: Int) = sellerService.featuredSellers(offsetMinutes)

}
