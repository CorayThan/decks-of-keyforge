package coraythan.keyswap.decks.pastsas

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.PastSas
import coraythan.keyswap.synergy.DeckSynergyInfo
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class PastSasService(
        private val pastSasRepo: PastSasRepo,
        private val cardService: CardService,
) {

    fun findByDeckId(id: Long) = pastSasRepo.findByDeckId(id)
            .sortedByDescending { it.updateDateTime }

    fun createAll(decks: List<Pair<Deck, DeckSynergyInfo>>) {
        pastSasRepo.saveAll(decks.map {
            convertToPastSas(it.first, it.second)
        })
    }

    private fun convertToPastSas(deck: Deck, synergies: DeckSynergyInfo) = PastSas(
            deckId = deck.id,

            expectedAmber = synergies.expectedAmber,
            amberControl = synergies.amberControl,
            creatureControl = synergies.creatureControl,
            artifactControl = synergies.artifactControl,
            efficiency = synergies.efficiency,
            creatureProtection = synergies.creatureProtection,
            disruption = synergies.disruption,
            other = synergies.other,
            effectivePower = synergies.effectivePower,

            aercScore = synergies.rawAerc,
            sasRating = synergies.sasRating,
            synergyRating = synergies.synergyRating,
            antisynergyRating = synergies.antisynergyRating,
            meta = synergies.metaScores.values.sum(),

            aercVersion = cardService.activeAercVersion,
    )
}