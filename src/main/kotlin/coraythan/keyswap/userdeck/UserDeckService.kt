package coraythan.keyswap.userdeck

import coraythan.keyswap.decks.DeckRepo
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
        val deckRepo: DeckRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun addToWishlist(deckId: Long) {
        modUserDeck(deckId) {
            it.copy(wishlist = true)
        }
    }

    fun removeFromWishlist(deckId: Long) {
        modUserDeck(deckId) {
            it.copy(wishlist = false)
        }
    }

    private fun modUserDeck(deckId: Long, mod: (userDeck: UserDeck) -> UserDeck) {
        log.info("modifying userdeck")
        val currentUser = currentUserService.loggedInUser()!!
        val deck = currentUser.decks.filter { it.deck.id == deckId }.getOrElse(0) {
            UserDeck(currentUser, deckRepo.getOne(deckId))
        }

        val toSave = currentUser.copy(decks = currentUser.decks.filter { it.deck.id != deckId }.plus(
                mod(deck)
        ))
        userRepo.save(toSave)
    }
}