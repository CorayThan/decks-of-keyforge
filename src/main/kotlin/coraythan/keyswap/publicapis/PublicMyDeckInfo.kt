package coraythan.keyswap.publicapis

import coraythan.keyswap.decks.models.DeckSearchResult

data class PublicMyDeckInfo(
        val deck: DeckSearchResult,

        val wishlist: Boolean,
        val funny: Boolean,

        val notes: String?,

        val ownedByMe: Boolean
)