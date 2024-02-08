package coraythan.keyswap.cards.dokcards

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.CardsVersionService
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.expansions.Expansion
import org.slf4j.LoggerFactory
import org.springframework.http.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
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
    private val restTemplate: RestTemplate,
    private val dokCardExpansionRepo: DokCardExpansionRepo,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    @Transactional
    fun updateRarities() {
        log.info("Begin updating dok card expansion rarities.")
        val allCards = dokCardRepo.findAll()
        allCards.forEach { dokCard ->
            dokCard.expansions.forEach { expansion ->
                val cards = cardRepo.findByExpansionAndCardTitle(expansion.expansion.expansionNumber, dokCard.cardTitle)
                val card = cards.firstOrNull { !it.maverick } ?: cards.firstOrNull()
                if (card == null) {
                    log.warn("No card for ${dokCard.cardTitle} $expansion")
                    val cardNoExpansion = cardRepo.findFirstByCardTitle(dokCard.cardTitle)
                    dokCardExpansionRepo.save(
                        expansion.copy(rarity = cardNoExpansion.rarity)
                    )
                } else {
                    if (expansion.rarity != card.rarity) {
                        dokCardExpansionRepo.save(
                            expansion.copy(rarity = card.rarity)
                        )
                    }
                }
            }
        }
        log.info("End updating dok card expansion rarities.")
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
                // Existing card. Let's update it if necessary
                if (dokCardUpdateDao.updateDokCard(card.id)) updatedCards = true
            }
        }

        if (updatedCards) {
            versionService.revVersion()
        }
        return updatedCards
    }

    fun downloadAllNewCardImages(fromExpansions: Set<Expansion>, fromHouses: Set<House> = setOf()) {
        val findCards = fromExpansions.flatMap { cardRepo.findByExpansion(it.expansionNumber) }
            .filter {
                it.frontImage.contains("mastervault-storage-prod.s3")
                        && (fromHouses.isEmpty() || (fromHouses.contains(it.house) && !it.maverick))
            }
            .distinctBy { it.cardTitle }

        val findDecksNotAlreadyFound = findCards
            .filter {
                val titleMod = it.cardTitle.toUrlFriendlyCardTitle()
                !File("card-imgs/$titleMod.png").exists()
            }
            // Ghostform image is borked
            .filter { it.cardTitle != "Ghostform" }

        log.info("${findCards.size} deck images, ${findDecksNotAlreadyFound.size} not already found finding cards ${findDecksNotAlreadyFound.map { it.cardTitle }}")

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
