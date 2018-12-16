package coraythan.keyswap.decks

import coraythan.keyswap.cards.CardService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class DeckImporter(
        val keyforgeApi: KeyforgeApi,
        val cardService: CardService,
        val deckRepo: DeckRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    // @Scheduled(fixedDelay = 1000 * 60)
    fun importNewDecks() {

        val decksPerPage = 10
        val currentDecks = deckRepo.count().toInt()
        var currentPage = 1 + currentDecks / decksPerPage

        val newDeckTotal = keyforgeApi.findDecks(1, 1)?.count
        if (newDeckTotal == null) {
            log.warn("Got null when getting the count for all decks!")
            return
        }
        val finalPage = 1 + newDeckTotal / decksPerPage

        val maxPageRequests = 10
        var pagesRequested = 0
        while (currentPage < finalPage && pagesRequested < maxPageRequests) {
            val decks = keyforgeApi.findDecks(currentPage, decksPerPage)
//            log.info("Found decks from api count ${decks?.data?.size}.")
            if (decks == null) {
                log.warn("Got null decks from the api for page $currentPage decks per page $decksPerPage with new deck total $newDeckTotal")
            } else {
                cardService.importNewCards(decks.data)
                saveDecks(decks.data)
            }

            log.info("Loaded page $currentPage. Decks from db: ${deckRepo.findAll().count()}. Total current decks: $newDeckTotal")
            currentPage++
            pagesRequested++
        }
    }

    private fun saveDecks(deck: List<Deck>) {
        val saveableDecks = deck.map {
            val saveable = it.copy(
                    cardInstances = it.cards?.mapNotNull { cardService.cachedCards[it] }
                            ?: throw IllegalStateException("Can't have a deck with no cards deck: $deck"),
                    houses = it._links?.houses ?: throw java.lang.IllegalStateException("Deck didn't have houses.")
            )
            if (saveable.cardInstances.size != 36) {
                throw java.lang.IllegalStateException("Can't have a deck without 36 cards deck: $deck")
            }
            saveable
        }

        deckRepo.saveAll(saveableDecks)
    }

}
