package coraythan.keyswap.publicapis

import coraythan.keyswap.decks.models.DeckSearchResult

data class PublicMyDeckInfo(
        val deck: DeckSearchResult,

        val wishlist: Boolean = false,
        val funny: Boolean = false,

        val notes: String? = null,

        val ownedByMe: Boolean
)