package coraythan.keyswap.sasupdate

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/deck-sas-updates")
class DeckSasUpdateEndpoints(
    private val deckSasUpdateService: DeckSasUpdateService,
) {
    @PostMapping("/secured/publish")
    fun publishNewSasUpdate() = deckSasUpdateService.publishNewSasUpdate()
}
