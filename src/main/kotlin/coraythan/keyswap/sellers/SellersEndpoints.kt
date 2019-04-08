package coraythan.keyswap.sellers

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/sellers")
class SellersEndpoints(
        private val sellerService: SellerService
) {

    @GetMapping("/featured")
    fun featuredSellers(@RequestHeader(value="Timezone") offsetMinutes: Int) = sellerService.featuredSellers(offsetMinutes)

}
