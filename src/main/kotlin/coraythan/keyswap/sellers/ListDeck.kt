package coraythan.keyswap.sellers

import coraythan.keyswap.House
import coraythan.keyswap.userdeck.ListingInfo

data class ListDeck(
        val deckName: String? = null,
        val keyforgeId: String? = null,
        val deckInfo: DeckListingInfo? = null,
        val listingInfo: ListingInfo
)

data class DeckListingInfo(
        val name: String,
        val expansion: Int,
        val cards: List<DeckListingCard>
)

data class DeckListingCard(
        val cardNumber: Int,
        val house: House
)
