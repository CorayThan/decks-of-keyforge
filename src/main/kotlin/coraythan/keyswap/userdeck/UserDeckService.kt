package coraythan.keyswap.userdeck

import coraythan.keyswap.decks.Deck
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.now
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class UserDeckService(
        private val currentUserService: CurrentUserService,
        private val userRepo: KeyUserRepo,
        private val deckRepo: DeckRepo,
        private val userDeckRepo: UserDeckRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedRateString = "PT1M")
    fun unlistExpiredDecks() {
        val toUnlist = userDeckRepo.findAll(
                QUserDeck.userDeck.expiresAt.before(now())
        )
        toUnlist.forEach {
            unlistUserDeck(it)
            log.info("Unlisted ${it.id}")
        }
    }

    fun addToWishlist(deckId: Long, add: Boolean = true) {
        modOrCreateUserDeck(deckId, {
            it.cards.size
            it.copy(wishlistCount = it.wishlistCount + if (add) 1 else -1)
        }) {
            it.copy(wishlist = add)
        }
    }

    fun markAsFunny(deckId: Long, mark: Boolean = true) {
        modOrCreateUserDeck(deckId, {
            it.cards.size
            it.copy(funnyCount = it.funnyCount + if (mark) 1 else -1)
        }) {
            it.copy(funny = mark)
        }
    }

    fun markAsOwned(deckId: Long, mark: Boolean = true) {
        modOrCreateUserDeck(deckId, null) {
            it.copy(owned = mark)
        }
        if (!mark) {
            this.unlist(deckId)
        }
    }

    fun list(listingInfo: ListingInfo) {
        modOrCreateUserDeck(listingInfo.deckId, {
            it.copy(
                    forSale = it.forSale || listingInfo.forSale,
                    forTrade = it.forTrade || listingInfo.forTrade
            )
        }) {
            it.copy(
                    forSale = listingInfo.forSale,
                    forTrade = listingInfo.forTrade,
                    askingPrice = listingInfo.askingPrice,
                    listingInfo = if (listingInfo.listingInfo.isBlank()) null else listingInfo.listingInfo,
                    condition = listingInfo.condition,
                    externalLink = if (listingInfo.externalLink.isBlank()) null else listingInfo.externalLink,
                    dateListed = now(),
                    expiresAt = now().plusDays(listingInfo.expireInDays.toLong())
            )
        }
    }

    fun unlist(deckId: Long) {
        val currentUser = currentUserService.loggedInUser()!!
        val userDeck = currentUser.decks.filter { it.deck.id == deckId }.getOrElse(0) {
            UserDeck(currentUser, deckRepo.getOne(deckId))
        }
        unlistUserDeck(userDeck)
    }
    fun unlistUserDeck(userDeck: UserDeck) {
        val deckId = userDeck.deck.id
        userDeckRepo.save(userDeckWithoutListingInfo(userDeck))
        val userDeckQ = QUserDeck.userDeck
        val userDecksForSale = userDeckRepo.findAll(
                userDeckQ.forSale.isTrue
                        .and(userDeckQ.deck.id.eq(deckId))
                        .and(userDeckQ.id.ne(userDeck.id))
        )
        val userDecksForTrade = userDeckRepo.findAll(
                userDeckQ.forTrade.isTrue
                        .and(userDeckQ.deck.id.eq(deckId))
                        .and(userDeckQ.id.ne(userDeck.id))
        )
        deckRepo.save(userDeck.deck.copy(
                forSale = userDecksForSale.toList().isNotEmpty(),
                forTrade = userDecksForTrade.toList().isNotEmpty()
        ))
    }

    private fun userDeckWithoutListingInfo(userDeck: UserDeck) = userDeck.copy(
            forSale = false,
            forTrade = false,
            askingPrice = null,
            listingInfo = null,
            condition = null,
            dateListed = null,
            expiresAt = null,
            externalLink = null
    )


    private fun modOrCreateUserDeck(deckId: Long, modDeck: ((deck: Deck) -> Deck)?, mod: (userDeck: UserDeck) -> UserDeck) {
        log.info("modifying userdeck")
        val currentUser = currentUserService.loggedInUser()!!
        val userDeck = currentUser.decks.filter { it.deck.id == deckId }.getOrElse(0) {
            UserDeck(currentUser, deckRepo.getOne(deckId))
        }

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
