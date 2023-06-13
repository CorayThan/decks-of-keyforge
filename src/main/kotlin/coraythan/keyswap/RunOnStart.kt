package coraythan.keyswap

import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.synergy.FixSynergies
import coraythan.keyswap.users.search.UserSearchService
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.http.*
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import java.io.File
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

        log.info(
            "\n" + """
            .-./`) ,---------.         .--.      .--.    ,-----.    .-------.    .--.   .--.      .-''-.   ______     .---.  
            \ .-.')\          \        |  |_     |  |  .'  .-,  '.  |  _ _   \   |  | _/  /     .'_ _   \ |    _ `''. \   /  
            / `-' \ `--.  ,---'        | _( )_   |  | / ,-.|  \ _ \ | ( ' )  |   | (`' ) /     / ( ` )   '| _ | ) _  \|   |  
             `-'`"`    |   \           |(_ o _)  |  |;  \  '_ /  | :|(_ o _) /   |(_ ()_)     . (_ o _)  ||( ''_'  ) | \ /   
             .---.     :_ _:           | (_,_) \ |  ||  _`,/ \ _/  || (_,_).' __ | (_,_)   __ |  (_,_)___|| . (_) `. |  v    
             |   |     (_I_)           |  |/    \|  |: (  '\_/ \   ;|  |\ \  |  ||  |\ \  |  |'  \   .---.|(_    ._) ' _ _   
             |   |    (_(=)_)          |  '  /\  `  | \ `"/  \  ) / |  | \ `'   /|  | \ `'   / \  `-'    /|  (_.\.' / (_I_)  
             |   |     (_I_)           |    /  \    |  '. \_/``".'  |  |  \    / |  |  \    /   \       / |       .' (_(=)_) 
             '---'     '---'           `---'    `---`    '-----'    ''-'   `'-'  `--'   `'-'     `'-..-'  '-----'`    (_I_)  
        """.trimIndent() + "\n"
        )
    }

    private fun downloadAllNewCardImages() {
        val findDecks = cardRepo.findByExpansion(Expansion.WINDS_OF_EXCHANGE.expansionNumber)
            .plus(cardRepo.findByExpansion(Expansion.ANOMALY_EXPANSION.expansionNumber))
            .filter { it.frontImage.contains("mastervault-storage-prod.s3") }
            .distinctBy { it.cardTitle }

        val findDecksNotAlreadyFound = findDecks
            .filter {
                val titleMod = it.cardTitle.toUrlFriendlyCardTitle()
                !File("card-imgs/$titleMod.png").exists()
            }
            // Ghostform image is borked
            .filter { it.cardTitle != "Ghostform" }

        log.info("${findDecks.size} deck images, ${findDecksNotAlreadyFound.size} not already found finding decks ${findDecksNotAlreadyFound.map { it.cardTitle }}")

        findDecksNotAlreadyFound.forEach { card ->

            val titleMod = card.cardTitle.toUrlFriendlyCardTitle()
            val headers = HttpHeaders()
            headers.accept = listOf(MediaType.APPLICATION_OCTET_STREAM)

            val entity = HttpEntity<String>(headers)

            try {
                val response = restTemplate.exchange(
                    card.frontImage,
                    HttpMethod.GET, entity, ByteArray::class.java, "1"
                )

                if (response.statusCode == HttpStatus.OK) {
                    val written = Files.write(Paths.get("card-imgs/$titleMod.png"), response.body!!)
                    log.info("Wrote card image to location ${written.toAbsolutePath()}")
                } else {
                    log.warn("No card for ${card.cardTitle} ${card.id}")
                }
            } catch (e: Exception) {
                log.error("Couldn't get card ${card.cardTitle} via endpoint ${card.frontImage}", e)
            }
        }
        log.info("Creating card imgs complete.")
    }
}

fun String.toUrlFriendlyCardTitle(): String {
    return this
        .replace("[^\\d\\w\\s]".toRegex(), "")
        .replace(" ", "-")
        .lowercase()
}
