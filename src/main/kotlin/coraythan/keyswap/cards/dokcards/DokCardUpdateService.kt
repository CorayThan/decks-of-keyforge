package coraythan.keyswap.cards.dokcards

import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.CardsVersionService
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.cards.extrainfo.ExtraCardInfoService
import coraythan.keyswap.expansions.Expansion
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.*
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths

@Service
class DokCardUpdateService(
    private val cardRepo: CardRepo,
    private val versionService: CardsVersionService,
    private val dokCardRepo: DokCardRepo,
    private val dokCardUpdateDao: DokCardUpdateDao,
    private val extraCardInfoService: ExtraCardInfoService,
    private val restTemplate: RestTemplate,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private var createAllDokCardsPage = 0
    private var findMoreCards = true

    @Scheduled(
        fixedDelayString = "PT100H",
        initialDelayString = "PT10S"
    )
    fun createAllDokCards() {
        log.info("Start create all DoK Cards")

        extraCardInfoService.trueExtraCardInfoTitles()

        while (findMoreCards) {
            val foundCards = cardRepo.findAll(PageRequest.of(createAllDokCardsPage, 1000, Sort.by("id")))
            val foundCardsList = foundCards.toList()
            if (foundCardsList.size == 0) {
                findMoreCards = false
            } else {
                createDoKCardsFromKCards(foundCardsList)
            }
            log.info("Create All Dok Cards Page $createAllDokCardsPage complete, found ${foundCardsList.size} cards.")
            createAllDokCardsPage++
        }
    }

    fun createDoKCardsFromKCards(cards: List<Card>): Boolean {
        var updatedCards = false

        cards.forEach { card ->
            val existingCard = dokCardRepo.findByCardTitleUrl(card.cardTitle.toUrlFriendlyCardTitle())
            if (card.big == true && card.rarity == Rarity.FIXED) {
                // Skip fixed rarity big cards
                log.info("Skipping saving ${card.cardTitle} because it is a fixed rarity big")
            } else if (existingCard == null) {
                // Brand new card! Let's save it.
                dokCardUpdateDao.saveDokCard(card.id)
                updatedCards = true
            } else {
                // Existing card. Let's update the expansions and houses if necessary
                updatedCards = dokCardUpdateDao.updateDokCard(card.id)
            }
        }

        if (updatedCards) {
            versionService.revVersion()
        }
        return updatedCards
    }

    fun downloadAllNewCardImages() {
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

private val cardNameUrlRegex = "[^\\d\\w\\s]".toRegex()

fun String.toUrlFriendlyCardTitle(): String {
    return this
        .replace(cardNameUrlRegex, "")
        .replace(" ", "-")
        .lowercase()
}
