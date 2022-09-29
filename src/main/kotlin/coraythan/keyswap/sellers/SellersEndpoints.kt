package coraythan.keyswap.sellers

import coraythan.keyswap.Api
import coraythan.keyswap.userdeck.UpdatePrice
import org.springframework.http.CacheControl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("${Api.base}/sellers")
class SellersEndpoints(
    private val sellerService: SellerService
) {

    @PostMapping("/secured/update-prices")
    fun updatePrices(@RequestBody prices: List<UpdatePrice>) = sellerService.updatePrices(prices)

    @GetMapping("/featured")
    fun featuredSellers(@RequestHeader(value = "Timezone") offsetMinutes: Int): ResponseEntity<List<SellerDetails>> {
        return ResponseEntity.ok().cacheControl(
            CacheControl
                .maxAge(10, TimeUnit.MINUTES)
        ).body(sellerService.featuredSellers(offsetMinutes))
    }

    @PostMapping("/secured/store-icon")
    fun addStoreIcon(
        @RequestParam("storeImage")
        storeImage: MultipartFile,

        @RequestHeader("Extension")
        extension: String

    ) = sellerService.addStoreIcon(storeImage, extension)

    @PostMapping("/secured/store-banner")
    fun addStoreBanner(
        @RequestParam("storeImage")
        storeImage: MultipartFile,

        @RequestHeader("Extension")
        extension: String
    ) = sellerService.addStoreBanner(storeImage, extension)

    @DeleteMapping("/secured/icon")
    fun deleteStoreIcon() = sellerService.deleteStoreIcon()

    @DeleteMapping("/secured/banner")
    fun deleteStoreBanner() = sellerService.deleteStoreBanner()
}
