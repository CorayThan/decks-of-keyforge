package coraythan.keyswap.thirdpartyservices

import coraythan.keyswap.decks.Wins
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

data class CrucibleTrackerDeckWins(
        val decks: Map<String, Wins>
)

@Service
class CrucibleTrackerApi(
        private val restTemplate: RestTemplate
) {
    fun findWins(): CrucibleTrackerDeckWins {
        return restTemplate.getForObject("https://www.thecrucibletracker.com/api/decks", CrucibleTrackerDeckWins::class.java)
                ?: throw RuntimeException("Couldn't get deck wins from crucible tracker!")
    }
}
