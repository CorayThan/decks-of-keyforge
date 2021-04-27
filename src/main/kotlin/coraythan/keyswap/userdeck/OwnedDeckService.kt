package coraythan.keyswap.userdeck

import coraythan.keyswap.decks.models.DeckSearchResult
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class OwnedDeckService(
        private val ownedDeckRepo: OwnedDeckRepo,
) {
    fun addOwners(deck: DeckSearchResult): DeckSearchResult {
        val owners = ownedDeckRepo.findByDeckId(deck.id).mapNotNull { userDeck ->
            if (userDeck.owner.allowUsersToSeeDeckOwnership) {
                userDeck.owner.username
            } else {
                null
            }
        }
        return if (owners.isNotEmpty()) {
            deck.copy(owners = owners)
        } else {
            deck
        }
    }
}
