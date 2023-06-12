package coraythan.keyswap.publicapis

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.models.DeckSearchResult
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.userdeck.FavoritedDeckRepo
import coraythan.keyswap.userdeck.FunnyDeckRepo
import coraythan.keyswap.userdeck.OwnedDeckRepo
import coraythan.keyswap.userdeck.UserDeckRepo
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
        private val deckRepo: DeckRepo,
        private val cardService: CardService,
        private val statsService: StatsService,
        private val userDeckRepo: UserDeckRepo,
        private val ownedDeckRepo: OwnedDeckRepo,
        private val favoritedDeckRepo: FavoritedDeckRepo,
        private val funnyDeckRepo: FunnyDeckRepo,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun findMyDeckIds(user: KeyUser): List<String> {
        return ownedDeckRepo.findAllByOwnerId(user.id)
                .map { it.deck.keyforgeId }
    }

    fun findMyDecks(user: KeyUser): List<PublicMyDeckInfo> {
        return ownedDeckRepo.findAllByOwnerId(user.id)
                .map {
                    PublicMyDeckInfo(
                            deck = it.deck.toDeckSearchResult(
                                    stats = statsService.cachedStats
                            ),
                            wishlist = favoritedDeckRepo.existsByDeckIdAndUserId(it.deck.id, user.id),
                            funny = funnyDeckRepo.existsByDeckIdAndUserId(it.deck.id, user.id),
                            notes = userDeckRepo.findByUserIdAndDeckId(user.id, it.deck.id)?.notes,
                            ownedByMe = true
                    )
                }
    }

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
                housesAndCards = cardService.deckToHouseAndCards(deck),
                cards = cardService.cardsForDeck(deck),
                stats = statsService.findCurrentStats(),
            token = cardService.tokenForDeck(deck),
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

}
