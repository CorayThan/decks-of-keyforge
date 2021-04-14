package coraythan.keyswap

import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.synergy.FixSynergies
import coraythan.keyswap.userdeck.OwnedDeckRepo
import coraythan.keyswap.users.KeyUserRepo
import coraythan.keyswap.users.search.UserSearchService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.http.*
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import java.nio.file.Files
import java.nio.file.Paths

var startupComplete = false

@Transactional
@Component
class RunOnStart(
        private val cardService: CardService,
        private val fixSynergies: FixSynergies,
        private val userSearchService: UserSearchService,
        private val cardRepo: CardRepo,
        private val restTemplate: RestTemplate,
        private val userRepo: KeyUserRepo,
        private val ownedDeckRepo: OwnedDeckRepo,
) : CommandLineRunner {

    private val log = LoggerFactory.getLogger(this::class.java)

    override fun run(vararg args: String?) {

        fixSynergies.fix()

        cardService.publishNextInfo()
        cardService.loadExtraInfo()
        cardService.allFullCardsNonMaverick()

        // log.info("Deck stats json: \n\n${statsService.findDeckStatsJson().toList()[0].deckStats}\n\n")

        // deckImporterService.updateDeckStats()

//        this.downloadAllNewCardImages()

        userSearchService.updateSearchResults()

        startupComplete = true

        log.info("\n" + """
              _________ __                 __     ____ ___          _________                       .__          __        ._.
             /   _____//  |______ ________/  |_  |    |   \______   \_   ___ \  ____   _____ ______ |  |   _____/  |_  ____| |
             \_____  \\   __\__  \\_  __ \   __\ |    |   /\____ \  /    \  \/ /  _ \ /     \\____ \|  | _/ __ \   __\/ __ \ |
             /        \|  |  / __ \|  | \/|  |   |    |  / |  |_> > \     \___(  <_> )  Y Y  \  |_> >  |_\  ___/|  | \  ___/\|
            /_______  /|__| (____  /__|   |__|   |______/  |   __/   \______  /\____/|__|_|  /   __/|____/\___  >__|  \___  >_
                    \/           \/                        |__|             \/             \/|__|             \/          \/\/
        """.trimIndent() + "\n")
    }

    private fun downloadAllNewCardImages() {
        cardRepo.findByExpansion(Expansion.MASS_MUTATION.expansionNumber)
                .distinctBy { it.cardTitle }
                .forEach { card ->

                    val headers = HttpHeaders()
                    headers.accept = listOf(MediaType.APPLICATION_OCTET_STREAM)

                    val entity = HttpEntity<String>(headers)

                    val response = restTemplate.exchange(
                            card.frontImage,
                            HttpMethod.GET, entity, ByteArray::class.java, "1")

                    if (response.statusCode == HttpStatus.OK) {
                        val titleMod = card.cardTitle.toUrlFriendlyCardTitle()

                        val written = Files.write(Paths.get("card-imgs/$titleMod.png"), response.body!!)
                        log.info("Wrote card image to location ${written.toAbsolutePath()}")
                    }
                }
        log.info("Creating card imgs complete.")
    }
}

fun String.toUrlFriendlyCardTitle(): String {
    return this
            .replace("[^\\d\\w\\s]".toRegex(), "")
            .replace(" ", "-")
            .toLowerCase()
}
