package coraythan.keyswap.userdeck

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.salenotifications.ForSaleNotificationsService
import coraythan.keyswap.now
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
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
        private val userDeckRepo: UserDeckRepo,
        private val forSaleNotificationsService: ForSaleNotificationsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedDelayString = "PT6H")
    fun unlistExpiredDecks() {
        val toUnlist = userDeckRepo.findAll(
                QUserDeck.userDeck.expiresAt.before(now())
        )
        log.info("Unlisting ${toUnlist.toList().size} decks.")
        toUnlist.forEach {
            unlistUserDeck(it)
            log.info("Unlisted ${it.id}")
        }
    }

    fun addToWishlist(deckId: Long, add: Boolean = true) {
        modOrCreateUserDeck(deckId, currentUserService.loggedInUser()!!, {
            it.copy(wishlistCount = it.wishlistCount + if (add) 1 else -1)
        }) {
            it.copy(wishlist = add)
        }
    }

    fun markAsFunny(deckId: Long, mark: Boolean = true) {
        modOrCreateUserDeck(deckId, currentUserService.loggedInUser()!!, {
            it.copy(funnyCount = it.funnyCount + if (mark) 1 else -1)
        }) {
            it.copy(funny = mark)
        }
    }

    fun markAsOwned(deckId: Long, mark: Boolean = true) {
        val user = currentUserService.loggedInUser()!!
        modOrCreateUserDeck(deckId, user, null) {
            it.copy(ownedBy = if (mark) user.username else null)
        }
        if (!mark) {
            this.unlist(deckId)
        }
    }

    fun unmarkAsOwnedForSeller(deckId: Long, owner: KeyUser) {
        modOrCreateUserDeck(deckId, owner, null) {
            it.copy(ownedBy = null)
        }
    }

    fun list(
            listingInfo: ListingInfo,
            user: KeyUser? = null
    ) {
        val currentUser = user ?: (currentUserService.loggedInUser() ?: throw BadRequestException("You aren't logged in"))
        if (listingInfo.deckId == null) throw BadRequestException("Must include a deck ID to list a deck.")

        // Unlist if it is currently listed to support "updates"
        val preexisting = userDeckRepo.findByDeckIdAndUserId(listingInfo.deckId, currentUser.id)
        val preexistingForSale = preexisting?.forSale
        val preexistingForTrade = preexisting?.forTrade
        if (preexisting != null) {
            unlistUserDeck(preexisting)
        }

        if (!listingInfo.forSale && !listingInfo.forTrade) throw BadRequestException("Listing info must be for sale or trade.")
        modOrCreateUserDeck(listingInfo.deckId, currentUser, {
            it.copy(
                    forSale = it.forSale || listingInfo.forSale,
                    forTrade = it.forTrade || listingInfo.forTrade
            )
        }) {
            it.copy(
                    forSale = listingInfo.forSale,
                    forTrade = listingInfo.forTrade,
                    forSaleInCountry = listingInfo.forSaleInCountry,
                    askingPrice = listingInfo.askingPrice,
                    listingInfo = if (listingInfo.listingInfo.isNullOrBlank()) null else listingInfo.listingInfo,
                    condition = listingInfo.condition,
                    externalLink = if (listingInfo.externalLink.isNullOrBlank()) null else listingInfo.externalLink,
                    dateListed = now(),
                    expiresAt = if (listingInfo.expireInDays == null) null else now().plusDays(listingInfo.expireInDays.toLong()),
                    ownedBy = currentUser.username
            )
        }
        if (preexisting == null || (preexistingForSale == false && preexistingForTrade == false)) {
            // Send email since this is a new listing
            forSaleNotificationsService.sendNotifications(listingInfo)
        }
    }

    fun unlist(deckId: Long) {
        val currentUser = currentUserService.loggedInUser()!!
        unlistForUser(deckId, currentUser)
    }

    fun unlistForUser(deckId: Long, user: KeyUser) {
        unlistUserDeck(userDeckRepo.findByDeckIdAndUserId(deckId, user.id) ?: throw IllegalStateException("Couldn't find your deck listing."))
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
            forSaleInCountry = null,
            askingPrice = null,
            listingInfo = null,
            condition = null,
            dateListed = null,
            expiresAt = null,
            externalLink = null
    )


    private fun modOrCreateUserDeck(
            deckId: Long,
            currentUser: KeyUser,
            modDeck: ((deck: Deck) -> Deck)?,
            mod: (userDeck: UserDeck) -> UserDeck
    ) {
        val deck = deckRepo.getOne(deckId)
        val userDeck = currentUser.decks.filter { it.deck.id == deckId }.getOrElse(0) {
            UserDeck(currentUser, deck)
        }

        val toSave = currentUser.copy(decks = currentUser.decks.filter { it.deck.id != deckId }.plus(
                mod(userDeck)
        ))
        userRepo.save(toSave)

        if (modDeck != null) {
            deckRepo.save(modDeck(deck))
        }
    }
}
