package coraythan.keyswap.cards.dokcards

import coraythan.keyswap.House
import coraythan.keyswap.cards.*
import coraythan.keyswap.thirdpartyservices.S3Service
import coraythan.keyswap.thirdpartyservices.S3Service.Companion.cardImagesFolder
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.http.*
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate


@Service
class DokCardUpdateService(
    private val versionService: CardsVersionService,
    private val dokCardRepo: DokCardRepo,
    private val dokCardUpdateDao: DokCardUpdateDao,
    private val s3Service: S3Service,
    private val restTemplate: RestTemplate,
    private val tokenRepo: TokenRepo,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun createDoKCardsFromKCards(cards: List<Card>): CardsImportResults {
        var updatedCards = false
        var updatedTokens = false

        cards.forEach { card ->
            val existingCard = dokCardRepo.findByCardTitleUrl(card.cardTitle.toLegacyUrlFriendlyCardTitle())
            if (card.big == true && card.rarity == Rarity.FIXED) {
                // Skip fixed rarity big cards
                log.info("Skipping saving ${card.cardTitle} because it is a fixed rarity big")
            } else if (existingCard == null) {
                // Brand new card! Let's save it.
                dokCardUpdateDao.saveDokCard(card.id)
                if (card.token && !tokenRepo.existsByCardTitle(card.cardTitle)) {
                    val token = tokenRepo.save(Token(card.cardTitle))
                    DokCardCacheService.addToken(token.id, token.cardTitle)
                    updatedTokens = true
                }
                updatedCards = true
            } else {
                // Existing card. Let's update it if necessary
                if (dokCardUpdateDao.updateDokCard(card.id)) updatedCards = true
            }
        }

        if (updatedCards) {
            runBlocking {
                uploadImagesForCards(cards)
            }
            versionService.revVersion()
        }
        return CardsImportResults(updatedCards, updatedTokens)
    }

//    suspend fun uploadAllCardsFromKFDecks() {
//        val manualUploadCards = mutableListOf<String>()
//        dokCardRepo.findAll()
//            .forEach {
//                if (it.houses.isEmpty()) {
//                    if (!uploadCard(it, null)) {
//                        manualUploadCards.add(it.cardTitle)
//                    }
//                } else {
//                    it.houses.forEach { house ->
//                        if (!uploadCard(it, house)) {
//                            manualUploadCards.add("${it.cardTitle} - $house")
//                        }
//                    }
//                }
//            }
//
//        log.info("All done uploading cards from all KF decks! Do these manually: $manualUploadCards")
//    }

//    private suspend fun uploadCard(card: DokCard, house: House?): Boolean {
//        val titleMod = cardUrl(card.cardTitle, house, false)
//
//        val alreadyExists = s3Service.checkIfCardImageExists(titleMod)
//
//        if (alreadyExists) {
//            log.info("Didn't need to upload ${card.cardTitle}")
//            return true
//        } else {
//
//            val possibleCards = cardRepo.findByCardTitle(card.cardTitle)
//                .filter { it.frontImage.contains("mastervault-storage-prod.s3") && !it.anomaly }
//
//            if (possibleCards.isEmpty()) {
//
//                if (house != null) {
//
//                    val filters = if (card.cardTitle.contains("Evil Twin")) {
//                        DeckFilters(
//                            title = "Evil Twin",
//                            cards = listOf(
//                                DeckCardQuantity(
//                                    cardNames = listOf(card.cardTitle),
//                                    quantity = 1,
//                                )
//                            ),
//                        )
//                    } else {
//                        DeckFilters(
//                            cards = listOf(
//                                DeckCardQuantity(
//                                    cardNames = listOf(card.cardTitle),
//                                    quantity = 1,
//                                )
//                            ),
//                        )
//                    }
//
//                    val deckToCheck = deckSearchService.filterDecks(filters, 0)
//
//                    val deckId = deckToCheck.decks
//                        .firstOrNull()
//                    if (deckId == null) {
//                        log.error("No deck possible for card ${card.cardTitle} house $house")
//                        return false
//                    } else {
//                        val kfDeck = keyforgeApi.findDeck(deckId.keyforgeId, withCards = true)
//
//                        val kfCard = kfDeck?._linked?.cards?.firstOrNull {
//                            if (card.cardTitle.contains("Evil Twin")) {
//                                it.card_title == card.cardTitle.replace(" – Evil Twin", "")
//                            } else {
//                                it.card_title == card.cardTitle
//                            }
//                        }?.toCard()
//
//                        if (kfCard == null) {
//                            log.error("No card front image possible for card ${card.cardTitle} house $house in deck ${deckId.keyforgeId}")
//                            return false
//                        } else {
//                            log.info("Doing it the hard way! Attempt upload for card image $titleMod")
//                            attemptCardUpload(titleMod, kfCard)
//
//                            Thread.sleep(15000)
//                            return true
//                        }
//
//                    }
//
//                } else {
//                    log.error("There were no valid options for ${card.cardTitle} with house $house")
//                    return false
//                }
//
//            } else {
//                log.info("Attempt upload for card image $titleMod")
//                attemptCardUpload(titleMod, possibleCards.first())
//                return true
//            }
//
//        }
//    }

//    suspend fun uploadAllCards() {
//
//        val findCards: List<Card> = Expansion.entries
//            .flatMap { cardRepo.findByExpansion(it.expansionNumber) }
//            .filter { it.frontImage.contains("mastervault-storage-prod.s3") }
//            .distinctBy {
//                if (it.anomaly) {
//                    Pair(it.cardTitle, "anomaly")
//                } else if (it.maverick) {
//                    val dokCard = dokCardRepo.findByCardTitleUrl(it.cardTitle.toLegacyUrlFriendlyCardTitle())
//                    if (dokCard?.houses?.size == 1) {
//                        Pair(it.cardTitle, dokCard.houses.first())
//                    } else {
//                        Unit
//                    }
//                } else {
//                    Pair(it.cardTitle, it.house)
//                }
//            }
//
//        uploadImagesForCards(findCards)
//    }

    suspend fun uploadImagesForCards(cardsToUpload: List<Card>) {

        log.info("Upload images for ${cardsToUpload.size} cards")

        cardsToUpload.forEach { card ->

            val titleMod = cardUrl(card.cardTitle, card.house, card.anomaly)

            val alreadyExists = s3Service.checkIfCardImageExists(titleMod)

            if (alreadyExists) {
                log.info("Card image $titleMod already exists, don't upload image.")
            } else {
                log.info("Attempt upload for card image $titleMod")
                attemptCardUpload(titleMod, card)
            }
        }
    }

    private suspend fun attemptCardUpload(titleMod: String, card: Card) {
        val headers = HttpHeaders()
        headers.accept = listOf(MediaType.APPLICATION_OCTET_STREAM)

        val entity = HttpEntity<String>(headers)

        try {
            val response = restTemplate.exchange(
                card.frontImage,
                HttpMethod.GET, entity, ByteArray::class.java, "1"
            )

            val byteArray = response.body

            if (response.statusCode == HttpStatus.OK && byteArray != null) {

                s3Service.addCardImage(byteArray, titleMod)

            } else {
                log.warn("No card for ${card.cardTitle} ${card.id}")
            }
        } catch (e: Exception) {
            log.error("Couldn't get card ${card.cardTitle} via endpoint ${card.frontImage}", e)
        }
    }

}

private val cardNameUrlRegex = "[^\\d\\w\\s]".toRegex()
private val whitespaceRegex = "\\s+".toRegex()

fun String.toLegacyUrlFriendlyCardTitle(): String {
    return this
        .replace(cardNameUrlRegex, "")
        .replace(" ", "-")
        .lowercase()
}

fun cardUrl(cardTitle: String, house: House? = null, anomaly: Boolean = false): String {
    return "${if (anomaly) "anomaly" else house.toString().lowercase()}/${
        cardTitle
            .replace("Æ", "ae", ignoreCase = true)
            .replace(cardNameUrlRegex, "")
            .replace(whitespaceRegex, "-")
            .lowercase()
    }"
}

fun cardUrlFull(cardTitle: String, house: House? = null, anomaly: Boolean = false): String {
    return "https://keyforge-card-images.s3-us-west-2.amazonaws.com/$cardImagesFolder/${
        cardUrl(
            cardTitle,
            house,
            anomaly
        )
    }.png"
}
