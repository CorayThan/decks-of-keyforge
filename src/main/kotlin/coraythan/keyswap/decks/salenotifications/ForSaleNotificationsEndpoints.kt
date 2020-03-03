package coraythan.keyswap.decks.salenotifications

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/for-sale-notifications")
class ForSaleNotificationsEndpoints(
    private val forSaleNotificationsService: ForSaleNotificationsService
) {

    @PostMapping("/secured/add-query")
    fun addQuery(@RequestBody query: ForSaleQuery) {
        forSaleNotificationsService.addForSaleQuery(query)
    }

    @DeleteMapping("/secured/{id}")
    fun deleteQuery(@PathVariable id: UUID) {
        forSaleNotificationsService.deleteQuery(id)
    }

    @GetMapping("/secured")
    fun findAllForUser() = forSaleNotificationsService.findAllForUser()

    @GetMapping("/secured/count")
    fun findCountForUser() = forSaleNotificationsService.findCountForUser()
}
