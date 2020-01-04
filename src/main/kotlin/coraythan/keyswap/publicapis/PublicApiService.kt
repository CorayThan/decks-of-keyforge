package coraythan.keyswap.publicapis

import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckImporterService
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.models.DeckSearchResult
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.userdeck.UserDeckService
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.*

@Service
class PublicApiService(
        private val currentUserService: CurrentUserService,
        private val keyUserRepo: KeyUserRepo,
        private val userDeckService: UserDeckService,
        private val deckRepo: DeckRepo,
        private val deckImporterService: DeckImporterService,
        private val cardRepo: CardRepo,
        private val cardService: CardService,
        private val statsService: StatsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun findDeckSimple(keyforgeId: String): DeckSearchResult? {
        if (keyforgeId.length != 36) {
            log.info("Request for deck with malformed id: $keyforgeId")
            return null
        }
        val deck = deckRepo.findByKeyforgeId(keyforgeId)
        if (deck == null) {
            log.debug("Request for deck that doesn't exist $keyforgeId")
            return null
        }
        return deck.toDeckSearchResult(
                cards = cardService.cardsForDeck(deck),
                stats = statsService.findCurrentStats()
        )
    }

    fun generateApiKey(): String {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val apiKey = UUID.randomUUID().toString()
        val updatedUser = currentUser.copy(apiKey = apiKey)
        keyUserRepo.save(updatedUser)
        return apiKey
    }

    fun userForApiKey(apiKey: String): KeyUser {
        return keyUserRepo.findByApiKey(apiKey) ?: throw BadRequestException("Your api key is invalid. Please generate a new one.")
    }

//    fun listDeckForSeller(listDeck: ListDeck, seller: KeyUser) {
//        if (seller.country == null) throw IllegalStateException("Please select a country on your user profile before listing decks.")
//        val deckId: Long
//        if (listDeck.deckInfo == null) {
//            // preexisting deck
//
//            val deck = if (listDeck.keyforgeId != null && listDeck.keyforgeId.isNotBlank()) {
//                deckRepo.findByKeyforgeId(listDeck.keyforgeId) ?: throw BadRequestException("Couldn't find a registered deck with id ${listDeck.keyforgeId}")
//            } else if (listDeck.deckName != null && listDeck.deckName.isNotBlank()) {
//                deckRepo.findByNameAndRegisteredTrue(listDeck.deckName)
//                        ?: throw BadRequestException("Couldn't find a registered deck with name ${listDeck.keyforgeId}")
//            } else {
//                throw BadRequestException("Must include keyforge id or deck name to list a registered deck.")
//            }
//
//            deckId = deck.id
//
//        } else {
//            listDeck.deckInfo.cards.groupBy { it.house }
//                    .forEach { if (it.value.size != 12) throw BadRequestException("${it.key} has the wrong number of cards") }
//            // create a new deck
//            if (listDeck.keyforgeId != null) throw BadRequestException("Unregistered decks should not have a keyforge deck id.")
//
//            val preexistingUnregisteredDeck = deckRepo.findByName(listDeck.deckInfo.name)
//
//            deckId = if (preexistingUnregisteredDeck != null) {
//                preexistingUnregisteredDeck.id
//            } else {
//                val cards = listDeck.deckInfo.cards.map {
//                    val cardsByEch = cardRepo.findByExpansionAndCardNumberAndHouse(
//                            listDeck.deckInfo.expansion,
//                            it.cardNumber.toString(),
//                            it.house
//                    )
//                    if (cardsByEch.isEmpty()) {
//                        throw BadRequestException("No card for expansion ${listDeck.deckInfo.expansion} card number ${it.cardNumber} house ${it.house}")
//                    }
//                    cardsByEch[0]
//                }
//
//                val deckKeyforgeId = deckImporterService.addUnregisteredDeck(
//                        SaveUnregisteredDeck(
//                                cards = cards.groupBy { it.house },
//                                name = listDeck.deckInfo.name,
//                                expansion = listDeck.expansion
//                        ),
//                        seller
//                )
//
//                deckRepo.findByKeyforgeId(deckKeyforgeId)?.id ?: throw BadRequestException("Couldn't make the unregistered deck.")
//            }
//        }
//
//        userDeckService.list(
//                listDeck.listingInfo.copy(
//                        deckId = deckId,
//                        forSaleInCountry = seller.country
//                ),
//                seller
//        )
//    }

    fun unlistDeckForSeller(keyforgeId: String, seller: KeyUser) {
        val deck = deckRepo.findByKeyforgeId(keyforgeId) ?: throw BadRequestException("Couldn't find a registered deck with id ${keyforgeId}")
        unlist(deck.id, seller)
    }

    fun unlistDeckForSellerWithName(deckName: String, seller: KeyUser) {
        val deck = deckRepo.findByName(deckName) ?: throw BadRequestException("Couldn't find a deck with name ${deckName}")
        unlist(deck.id, seller)
    }

    private fun unlist(deckId: Long, seller: KeyUser) {
        userDeckService.unlistForUser(deckId, seller)
        userDeckService.unmarkAsOwnedForSeller(deckId, seller)
    }
}
