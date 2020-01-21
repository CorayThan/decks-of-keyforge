package coraythan.keyswap.config

import coraythan.keyswap.Api
import coraythan.keyswap.decks.models.doneRatingDecks
import coraythan.keyswap.startupComplete
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/status")
class ServerStatusEndpoints() {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun status() = ServerStatus(
            updatingDecks = !doneRatingDecks,
            siteUpdating = !startupComplete
    )
}

data class ServerStatus(
    val updatingDecks: Boolean,
    val siteUpdating: Boolean
)
