package coraythan.keyswap.sellers

import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckImporterService
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.SaveUnregisteredDeck
import coraythan.keyswap.userdeck.UserDeckService
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import org.springframework.stereotype.Service
import java.util.*

@Service
class SellerService(
        private val currentUserService: CurrentUserService,
        private val keyUserRepo: KeyUserRepo,
        private val userDeckService: UserDeckService,
        private val deckRepo: DeckRepo,
        private val deckImporterService: DeckImporterService,
        private val cardRepo: CardRepo
) {

    fun generateApiKey(): String {
        val currentUser = currentUserService.loggedInUser() ?: throw IllegalAccessError("You aren't logged in.")
        val apiKey = UUID.randomUUID().toString()
        val updatedUser = currentUser.copy(apiKey = apiKey)
        keyUserRepo.save(updatedUser)
        return apiKey
    }

    fun sellerForApiKey(apiKey: String): KeyUser {
        return keyUserRepo.findByApiKey(apiKey) ?: throw BadRequestException("Your api key is invalid. Please generate a new one.")
    }

    fun listDeckForSeller(listDeck: ListDeck, seller: KeyUser) {
        if (seller.country == null) throw IllegalStateException("Please select a country on your user profile before listing decks.")
        if (listDeck.deckInfo == null) {
            // preexisting deck

            val deck = if (listDeck.keyforgeId != null) {
                deckRepo.findByKeyforgeId(listDeck.keyforgeId) ?: throw BadRequestException("Couldn't find a registered deck with id ${listDeck.keyforgeId}")
            } else if (listDeck.deckName != null) {
                deckRepo.findByNameAndRegisteredTrue(listDeck.deckName)
                        ?: throw BadRequestException("Couldn't find a registered deck with name ${listDeck.keyforgeId}")
            } else {
                throw BadRequestException("Must include keyforge id or deck name to list a registered deck.")
            }

            userDeckService.list(
                    listDeck.listingInfo.copy(
                            deckId = deck.id,
                            forSaleInCountry = seller.country
                    )
            )

        } else {
            // create a new deck
            if (listDeck.keyforgeId != null) throw BadRequestException("Unregistered decks should not have a keyforge deck id.")

            val cards = listDeck.deckInfo.cards.map { cardRepo.findByExpansionAndCardNumberAndHouse(
                    listDeck.deckInfo.expansion,
                    it.cardNumber,
                    it.house
            ) ?: throw BadRequestException("No card for expansion ${listDeck.deckInfo.expansion} card number ${it.cardNumber} house ${it.house}") }

            deckImporterService.addUnregisteredDeck(
                    SaveUnregisteredDeck(
                            cards = cards.groupBy { it.house },
                            name = listDeck.deckInfo.name
                    )
            )

        }
    }

    fun unlistDeckForSeller(keyforgeId: String, seller: KeyUser) {
        val deck = deckRepo.findByKeyforgeId(keyforgeId) ?: throw BadRequestException("Couldn't find a registered deck with id ${keyforgeId}")
        userDeckService.unlistForUser(deck.id, seller)
    }

    fun unlistDeckForSellerWithName(deckName: String, seller: KeyUser) {
        val deck = deckRepo.findByName(deckName) ?: throw BadRequestException("Couldn't find a deck with name ${deckName}")
        userDeckService.unlistForUser(deck.id, seller)
    }
}
