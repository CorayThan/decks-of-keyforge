package coraythan.keyswap

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.DeckImporterService
import coraythan.keyswap.stats.StatsService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.http.*
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import java.nio.file.Files
import java.nio.file.Paths


@Component
class RunOnStart(
        private val cardService: CardService,
        private val deckImporterService: DeckImporterService,
        private val statsService: StatsService,
        private val restTemplate: RestTemplate
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {

        cardService.loadExtraInfo()
        cardService.allFullCardsNonMaverick()

        // log.info("Deck stats json: \n\n${statsService.findDeckStatsJson().toList()[0].deckStats}\n\n")

//        deckImporterService.updateDeckStats()

        // this.downloadAllCardImages()

    }

    private fun downloadAllCardImages() {
        cardService.allFullCardsNonMaverickNoDups()
                .forEach { card ->

                    val headers = HttpHeaders()
                    headers.accept = listOf(MediaType.APPLICATION_OCTET_STREAM)

                    val entity = HttpEntity<String>(headers)

                    val response = restTemplate.exchange(
                            card.frontImage,
                            HttpMethod.GET, entity, ByteArray::class.java, "1")

                    if (response.statusCode == HttpStatus.OK) {
                        val titleMod = card.cardTitle
                                .replace("[^\\d\\w\\s]".toRegex(), "")
                                .replace(" ", "-")
                                .toLowerCase()

                        val written = Files.write(Paths.get("card-imgs/$titleMod.png"), response.body!!)
                        log.info("Wrote card image to location ${written.toAbsolutePath()}")
                    }
                }
    }
}
