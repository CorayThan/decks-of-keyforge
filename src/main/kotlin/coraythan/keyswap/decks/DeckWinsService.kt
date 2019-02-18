package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.decks.models.withCards
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import net.javacrumbs.shedlock.core.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.system.measureTimeMillis

private const val lockUpdateWinsLosses = "PT24H"
private const val onceEverySixHoursLock = "PT6h"

@Transactional
@Service
class DeckWinsService(
        private val keyforgeApi: KeyforgeApi,
        private val cardService: CardService,
        private val deckRepo: DeckRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedRateString = onceEverySixHoursLock)
    @SchedulerLock(name = "updateWinsAndLosses", lockAtLeastForString = lockUpdateWinsLosses, lockAtMostForString = lockUpdateWinsLosses)
    fun updateWinsAndLosses() {

        log.info("Beginning deck win loss update")

        val updateWinsLossesDuration = measureTimeMillis {

            val deckIds = mutableSetOf<String>()
            val cardWins = mutableMapOf<String, Wins>()
            val houseWins = mutableMapOf<House, Wins>()

            val winPages = findAndUpdateDecksForWinRates("-wins", deckIds, cardWins, houseWins)
            // findAndUpdateDecksForWinRates("-losses", deckIds, cardWins, houseWins)
            log.info("Found $winPages win pages (of 10).")
        }
        log.info("It took ${updateWinsLossesDuration / 1000} seconds to update wins and losses.")
    }

    private fun findAndUpdateDecksForWinRates(
            order: String,
            deckIds: MutableSet<String>,
            cardWins: MutableMap<String, Wins>,
            houseWins: MutableMap<House, Wins>
    ): Int {

        var currentPage = 1

        while (true) {
            val decks = keyforgeApi.findDecks(currentPage, order)
            val updateDecks = decks?.data?.filter { it.losses != 0 || it.wins != 0 }
            if (updateDecks.isNullOrEmpty()) {
                break
            }
            updateDecks
                    .filter { !deckIds.contains(it.id) }
                    .forEach {
                        deckIds.add(it.id)
                        val preexisting = deckRepo.findByKeyforgeId(it.id)
                        if (preexisting != null) {
                            val cards = cardService.cardsForDeck(preexisting)
                            val updated = preexisting.withCards(cards).addGameStats(it)

//                        log.info("Deck before: ${preexisting?.wins} after: ${updated?.wins}")
//                        log.info("Deck before: ${preexisting?.losses} after: ${updated?.losses}")

                            if (updated != null) {
                                cards.forEach { card ->
                                    val wins = cardWins[card.cardTitle] ?: Wins()
                                    cardWins[card.cardTitle] = wins.copy(wins = wins.wins + updated.wins, losses = wins.losses + updated.losses)
                                }
                                updated.houses.forEach { house ->
                                    val wins = houseWins[house] ?: Wins()
                                    houseWins[house] = wins.copy(wins = wins.wins + updated.wins, losses = wins.losses + updated.losses)
                                }
                                deckRepo.save(updated)
                            }
                        }
                    }
            currentPage++
        }
        return currentPage
    }
}

data class Wins(
        val wins: Int = 0,
        val losses: Int = 0
)


