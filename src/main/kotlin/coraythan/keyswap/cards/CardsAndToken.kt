package coraythan.keyswap.cards

import coraythan.keyswap.cards.dokcards.DokCardInDeck

data class CardsAndToken(
    val cards: List<DokCardInDeck>,
    val token: DokCardInDeck?,
)
