package coraythan.keyswap.userdeck

import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.scheduledException
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import coraythan.keyswap.users.search.UserSearchService
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.EntityManager

@Transactional
@Service
class UserDeckService(
        private val currentUserService: CurrentUserService,
        private val userRepo: KeyUserRepo,
        private val deckRepo: DeckRepo,
        private val userSearchService: UserSearchService,
        private val userDeckRepo: UserDeckRepo,
        private val deckListingRepo: DeckListingRepo,
        private val previouslyOwnedDeckRepo: PreviouslyOwnedDeckRepo,
        private val ownedDeckRepo: OwnedDeckRepo,
        private val favoritedDeckRepo: FavoritedDeckRepo,
        private val funnyDeckRepo: FunnyDeckRepo,
        private val entityManager: EntityManager,
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val query = JPAQueryFactory(entityManager)

    // Don't want this running regularly
    @Scheduled(fixedDelayString = "PT24H", initialDelayString = SchedulingConfig.correctCountsInitialDelay)
    fun correctCounts() {
        log.info("$scheduledStart correcting counts.")
        try {
            userDeckRepo
                    .findAll(QUserDeck.userDeck.wishlist.isTrue)
                    .groupBy { it.deck.id }
                    .map { it.value.first().deck to it.value.size }
                    .forEach { if (it.first.wishlistCount != it.second) deckRepo.save(it.first.copy(wishlistCount = it.second)) }

            userDeckRepo
                    .findAll(QUserDeck.userDeck.funny.isTrue)
                    .groupBy { it.deck.id }
                    .map { it.value.first().deck to it.value.size }
                    .forEach { if (it.first.funnyCount != it.second) deckRepo.save(it.first.copy(funnyCount = it.second)) }
        } catch (e: Throwable) {
            log.error("$scheduledException Couldn't correct wishlist counts", e)
        }
        log.info("$scheduledStop correcting counts.")
    }

    fun addToWishlist(deckId: Long, add: Boolean = true) {

        val user = currentUserService.loggedInUserOrUnauthorized()
        val deck = deckRepo.findByIdOrNull(deckId) ?: throw BadRequestException("No deck with id $deckId")
        // To delete
        modOrCreateUserDeck(deckId, user, {
            it.copy(wishlistCount = it.wishlistCount + if (add) 1 else -1)
        }) {
            it.copy(wishlist = add)
        }

        // new code
        if (add) {
            favoritedDeckRepo.save(FavoritedDeck(user, deck))
        } else {
            favoritedDeckRepo.deleteByDeckIdAndUserId(deckId, user.id)
        }
    }

    fun updateNotes(deckId: Long, notes: String) {

        modOrCreateUserDeck(deckId, currentUserService.loggedInUserOrUnauthorized(), null) {
            it.copy(notes = notes)
        }
    }

    fun markAsFunny(deckId: Long, mark: Boolean = true) {

        val user = currentUserService.loggedInUserOrUnauthorized()
        val deck = deckRepo.findByIdOrNull(deckId) ?: throw BadRequestException("No deck with id $deckId")
        // To delete
        modOrCreateUserDeck(deckId, user, {
            it.copy(funnyCount = it.funnyCount + if (mark) 1 else -1)
        }) {
            it.copy(funny = mark)
        }

        // new code
        if (mark) {
            funnyDeckRepo.save(FunnyDeck(user, deck))
        } else {
            funnyDeckRepo.deleteByDeckIdAndUserId(deckId, user.id)
        }
    }

    fun markAsOwned(deckId: Long, mark: Boolean = true) {

        val user = currentUserService.loggedInUserOrUnauthorized()
        val teamId = user.teamId
        if (!mark && deckListingRepo.existsBySellerIdAndDeckIdAndStatusNot(user.id, deckId, DeckListingStatus.COMPLETE)) {
            throw BadRequestException("Please unlist the deck for sale before removing it from your decks.")
        }

        // Delete this eventually
        modOrCreateUserDeck(deckId, user, null) {
            it.copy(
                    ownedBy = if (mark) user.username else null,
                    teamId = if (mark && teamId != null) teamId else null
            )
        }

        val deck = deckRepo.findByIdOrNull(deckId) ?: throw BadRequestException("No deck for id $deckId")

        // new ownership code
        if (mark) {
            ownedDeckRepo.save(OwnedDeck(
                    owner = user,
                    deck = deck,
                    teamId = teamId,
            ))
        } else {
            ownedDeckRepo.deleteByDeckIdAndOwnerId(deck.id, user.id)
        }

        val previouslyOwned = previouslyOwnedDeckRepo.existsByDeckIdAndPreviousOwnerId(deckId, user.id)
        if (mark) {
            if (previouslyOwned) {
                previouslyOwnedDeckRepo.deleteByDeckIdAndPreviousOwnerId(deckId, user.id)
            }
        } else if (!previouslyOwned) {
            previouslyOwnedDeckRepo.save(PreviouslyOwnedDeck(user, deck))
        }
        userSearchService.scheduleUserForUpdate(user)
    }

    fun removePreviouslyOwned(deckId: Long) {

        val user = currentUserService.loggedInUserOrUnauthorized()
        if (previouslyOwnedDeckRepo.existsByDeckIdAndPreviousOwnerId(deckId, user.id)) {
            previouslyOwnedDeckRepo.deleteByDeckIdAndPreviousOwnerId(deckId, user.id)
        }
    }

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

    fun findOwned(): List<Long> {
        val currentUser = currentUserService.loggedInUser() ?: return listOf()
        return findOwnedDecks(currentUser.id)
    }

    fun findNotes(): List<DeckNotesDto> {
        val currentUser = currentUserService.loggedInUser() ?: return listOf()
        return findDeckNotes(currentUser.id)
    }

    fun findFavs(): List<Long> {
        val currentUser = currentUserService.loggedInUser() ?: return listOf()
        return findFavDecks(currentUser.id)
    }

    fun findFunnies(): List<Long> {
        val currentUser = currentUserService.loggedInUser() ?: return listOf()
        return findFunnyDecks(currentUser.id)
    }

    fun removeAllOwned() {

        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        log.info("Start removing all owned decks for ${currentUser.username}")

        var count = 0
        userDeckRepo.findByUserId(currentUser.id).forEach {
            count++
            this.markAsOwned(it.deck.id, false)
            if (count % 100 == 0) log.info("Removed $count decks from account for ${currentUser.username}")
        }

        log.info("Done removing all owned decks for ${currentUser.username}")
    }

    private fun findDeckNotes(userId: UUID): List<DeckNotesDto> {
        val userDeckQ = QUserDeck.userDeck
        return query
                .select(Projections.constructor(DeckNotesDto::class.java, userDeckQ.deck.id, userDeckQ.notes))
                .from(userDeckQ)
                .where(userDeckQ.user.id.eq(userId).and(userDeckQ.notes.isNotNull))
                .fetch()
    }

    private fun findOwnedDecks(userId: UUID): List<Long> {
        val ownedDeckQ = QOwnedDeck.ownedDeck
        return query
                .select(Projections.constructor(DeckOwnerDto::class.java, ownedDeckQ.deck.id))
                .from(ownedDeckQ)
                .where(ownedDeckQ.owner.id.eq(userId))
                .fetch()
                .map { it.deckId }
    }

    private fun findFavDecks(userId: UUID): List<Long> {
        val favDeckQ = QFavoritedDeck.favoritedDeck
        return query
                .select(Projections.fields(Long::class.java, favDeckQ.deck.id))
                .from(favDeckQ)
                .where(favDeckQ.user.id.eq(userId))
                .fetch()
    }

    private fun findFunnyDecks(userId: UUID): List<Long> {
        val funnyDeckQ = QFunnyDeck.funnyDeck
        return query
                .select(Projections.fields(Long::class.java, funnyDeckQ.deck.id))
                .from(funnyDeckQ)
                .where(funnyDeckQ.user.id.eq(userId))
                .fetch()
    }
}

data class DeckOwnerDto(
        val deckId: Long
)
