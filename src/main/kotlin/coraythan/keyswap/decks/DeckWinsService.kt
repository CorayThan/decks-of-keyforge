package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardRepo
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
        private val cardRepo: CardRepo,
        private val deckRepo: DeckRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedDelayString = onceEverySixHoursLock)
    @SchedulerLock(name = "updateWinsAndLosses", lockAtLeastForString = lockUpdateWinsLosses, lockAtMostForString = lockUpdateWinsLosses)
    fun updateWinsAndLosses() {

        log.info("Beginning deck win loss update")

        val updateWinsLossesDuration = measureTimeMillis {

            val deckIds = mutableSetOf<String>()

            val winPages = findAndUpdateDecksForWinRates("-wins", deckIds)
            findAndUpdateDecksForWinRates("-losses", deckIds)
            log.info("Found $winPages win pages (of 10).")
        }
        log.info("It took ${updateWinsLossesDuration / 1000} seconds to update wins and losses.")

        updateCardAndHouseWins()
    }

    private fun findAndUpdateDecksForWinRates(
            order: String,
            deckIds: MutableSet<String>
    ): Int {

        var currentPage = 1

        while (true) {
            val decks = keyforgeApi.findDecks(currentPage, order)
            val updateDecks = decks?.data?.filter { it.losses != 0 || it.wins != 0 }
            if (updateDecks.isNullOrEmpty()) {
                log.info("Update decks for $order was $updateDecks")
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

                            if (updated != null) {
                                deckRepo.save(updated)
                            }
                        }
                    }
            currentPage++
        }
        return currentPage
    }

    fun updateCardAndHouseWins() {
        log.info("Beginning card and house win loss update")

        val updateCardAndHouseWinsLossesDuration = measureTimeMillis {

            val decksWithScores = deckRepo.findByWinsGreaterThanOrLossesGreaterThan(0, 0)
            log.info("Found ${decksWithScores.size} decks with a win or loss. total wins ${decksWithScores.sumBy { it.wins }} " +
                    "losses ${decksWithScores.sumBy { it.losses }}")

            val cardWins = mutableMapOf<String, Wins>()
            val houseWins = mutableMapOf<House, Wins>()

            decksWithScores.forEach { deck ->
                val cards = cardService.cardsForDeck(deck)

                cards.forEach { card ->
                    val wins = cardWins[card.cardTitle] ?: Wins()
                    cardWins[card.cardTitle] = wins.copy(wins = wins.wins + deck.wins, losses = wins.losses + deck.losses)
                }
                deck.houses.forEach { house ->
                    val wins = houseWins[house] ?: Wins()
                    houseWins[house] = wins.copy(wins = wins.wins + deck.wins, losses = wins.losses + deck.losses)
                }
            }

            log.info(
                    "House wins: ${houseWins.map {
                        val wins = it.value.wins.toDouble()
                        "${it.key} = ${wins / (wins + it.value.losses.toDouble())} -- "
                    }}" + "house map: $houseWins")

            saveCardWins(cardWins)
            cardService.reloadCachedCards()
        }

        log.info("It took ${updateCardAndHouseWinsLossesDuration / 1000} seconds to update wins and losses for cards and houses.")

    }

    private fun saveCardWins(wins: Map<String, Wins>) {
        val cards = cardRepo.findByMaverickFalse()
                .map {
                    it.copy(
                            wins = wins[it.cardTitle]?.wins ?: 0,
                            losses = wins[it.cardTitle]?.losses ?: 0
                    )
                }
        cardRepo.saveAll(cards)
    }
}
