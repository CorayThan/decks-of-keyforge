package coraythan.keyswap.userdeck

import coraythan.keyswap.decks.Deck
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.now
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class UserDeckService(
        val currentUserService: CurrentUserService,
        val userRepo: KeyUserRepo,
        val deckRepo: DeckRepo,
        val userDeckRepo: UserDeckRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun addToWishlist(deckId: Long, add: Boolean = true) {
        modUserDeck(deckId, {
            it.cards.size
            it.copy(wishlistCount = it.wishlistCount + if (add) 1 else -1)
        }) {
            it.copy(wishlist = add)
        }
    }

    fun markAsFunny(deckId: Long, mark: Boolean = true) {
        modUserDeck(deckId, {
            it.cards.size
            it.copy(funnyCount = it.funnyCount + if (mark) 1 else -1)
        }) {
            it.copy(funny = mark)
        }
    }

    fun markAsOwned(deckId: Long, mark: Boolean = true) {
        modUserDeck(deckId, null) {
            it.copy(owned = mark)
        }
        if (!mark) {
            this.unlist(deckId)
        }
    }

    fun list(listingInfo: ListingInfo) {
        modUserDeck(listingInfo.deckId, {
            it.copy(
                    forSale = it.forSale || listingInfo.forSale,
                    forTrade = it.forTrade || listingInfo.forTrade
            )
        }) {
            it.copy(
                    forSale = listingInfo.forSale,
                    forTrade = listingInfo.forTrade,
                    askingPrice = listingInfo.askingPrice,
                    listingInfo = listingInfo.listingInfo,
                    condition = listingInfo.condition,
                    dateListed = now(),
                    dateRefreshed = now()
            )
        }
    }

    fun unlist(deckId: Long) {

        val currentUser = currentUserService.loggedInUser()!!
        val userDeck = currentUser.decks.filter { it.deck.id == deckId }.getOrElse(0) {
            UserDeck(currentUser, deckRepo.getOne(deckId))
        }

        val otherUserDecks = userDeckRepo.findByDeckId(deckId)
        var forSale = false
        var forTrade = false
        otherUserDecks.filter { it.id != userDeck.id }.forEach {
            if (it.forSale) {
                forSale = true
            }
            if (it.forTrade) {
                forTrade = true
            }
        }

        modUserDeck(deckId, {
            it.copy(forSale = forSale, forTrade = forTrade)
        }) {
            it.copy(
                    forSale = false,
                    forTrade = false,
                    askingPrice = null,
                    listingInfo = null,
                    condition = null,
                    dateListed = null,
                    dateRefreshed = null
            )
        }
    }

    private fun modUserDeck(deckId: Long, modDeck: ((deck: Deck) -> Deck)?, mod: (userDeck: UserDeck) -> UserDeck) {
        log.info("modifying userdeck")
        val currentUser = currentUserService.loggedInUser()!!
        val userDeck = currentUser.decks.filter { it.deck.id == deckId }.getOrElse(0) {
            UserDeck(currentUser, deckRepo.getOne(deckId))
        }.apply { deck.cards.size }

        val toSave = currentUser.copy(decks = currentUser.decks.filter { it.deck.id != deckId }.plus(
                mod(userDeck)
        ))
        userRepo.save(toSave)

        if (modDeck != null) {
            val deck = deckRepo.getOne(deckId)
            deckRepo.save(modDeck(deck))
        }
    }
}