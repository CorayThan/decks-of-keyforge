package coraythan.keyswap.decks.theoreticaldecks

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckImporterService
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckWithSynergyInfo
import coraythan.keyswap.decks.models.SaveUnregisteredDeck
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class TheoreticalDeckService(
        private val theoreticalDeckRepo: TheoreticalDeckRepo,
        private val deckSearchService: DeckSearchService,
        private val deckImporterService: DeckImporterService,
        private val cardService: CardService
) {

    fun saveTheoreticalDeck(toSave: SaveUnregisteredDeck): UUID {
        val deck = deckImporterService.viewTheoreticalDeck(toSave)
        val makeBelieveDeck = TheoreticalDeck(
                expansion = deck.expansion,
                cardIds = deck.cardIds,
                houseNamesString = deck.houseNamesString
        )
        return theoreticalDeckRepo.save(makeBelieveDeck).id
    }

    fun findTheoreticalDeck(id: UUID): DeckWithSynergyInfo {
        val theoryDeck = theoreticalDeckRepo.findByIdOrNull(id) ?: throw BadRequestException("No theoretical deck for id $id")
        val deck = Deck(
                name = "The One that Theoretically Exists",
                expansion = theoryDeck.expansion,
                keyforgeId = theoryDeck.id.toString(),
                cardIds = theoryDeck.cardIds,
                houseNamesString = theoryDeck.houseNamesString
        )
        val withCards = deck.withCards(cardService.cardsForDeck(deck))
        val rated = deckImporterService.rateDeck(withCards)
        return deckSearchService.deckToDeckWithSynergies(rated)
    }
}
