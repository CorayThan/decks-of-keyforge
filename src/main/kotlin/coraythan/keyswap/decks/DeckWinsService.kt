package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardRepo
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.models.KeyforgeDeck
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.thirdpartyservices.CrucibleTrackerApi
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import net.javacrumbs.shedlock.core.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.HttpClientErrorException
import kotlin.system.measureTimeMillis

private const val lockUpdateWinsLosses = "PT72H"
private const val lockCrucibleTrackerUpdateWinsLosses = "PT1H"
private const val onceEverySixHoursLock = "PT6H"
private const val lockUpdatePageOfWinLosses = "PT20S"

@Transactional
@Service
class DeckWinsService(
        private val keyforgeApi: KeyforgeApi,
        private val cardService: CardService,
        private val cardRepo: CardRepo,
        private val deckRepo: DeckRepo,
        private val deckPageService: DeckPageService,
        private val crucibleTrackerApi: CrucibleTrackerApi
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private var updatingWinsAndLosses: Boolean? = null

    var crucibleWins: Map<String, Wins> = mapOf()

    // TODO delete the columns
    @Scheduled(fixedDelayString = lockCrucibleTrackerUpdateWinsLosses)
    fun updateCrucibleTrackerWinsAndLosses() {

        log.info("$scheduledStart start crucible tracker deck win loss update")

        try {
            this.crucibleWins = crucibleTrackerApi.findWins().decks
        } catch (exception: Exception) {
            log.warn("Couldn't get crucible tracker wins due to ${exception.message}")
        }

        log.info("$scheduledStop done crucible tracker deck win loss update.")
    }

    @Scheduled(fixedDelayString = onceEverySixHoursLock, initialDelayString = SchedulingConfig.winsLossesInitialDelay)
    @SchedulerLock(name = "updateWinsAndLosses", lockAtLeastForString = lockUpdateWinsLosses, lockAtMostForString = lockUpdateWinsLosses)
    fun updateWinsAndLosses() {

        log.info("$scheduledStart start deck win loss update")

        val winsPage = deckPageService.findCurrentPage(DeckPageType.WINS)
        val lossesPage = deckPageService.findCurrentPage(DeckPageType.LOSSES)
        updatingWinsAndLosses = true
        if (winsPage != -1 || lossesPage != -1) {
            log.info("Had to abort deck win loss update. Apparently they aren't done yet.")
            return
        }
        deckPageService.setCurrentPage(1, DeckPageType.WINS)
        deckPageService.setCurrentPage(-1, DeckPageType.LOSSES)
        log.info("$scheduledStop done deck win loss update starting")
    }

    fun updateSingleDeck(deckId: String) {
        val deck = keyforgeApi.findDeck(deckId, false)
        if (deck != null) {
            saveDeckWins(deck.data)
        }
    }

    @Scheduled(fixedDelayString = lockUpdatePageOfWinLosses)
    @SchedulerLock(name = "updateWinsLossesPage", lockAtLeastForString = lockUpdatePageOfWinLosses, lockAtMostForString = lockUpdatePageOfWinLosses)
    fun findAndUpdateDecksForWinRates() {

        if (!deckImportingUpToDate) {
            log.info("Skipping find and update deck win rates due to deck importing not up to date.")
            return
        }

        if (updatingWinsAndLosses == null) {
            val winsPage = deckPageService.findCurrentPage(DeckPageType.WINS)
            val lossesPage = deckPageService.findCurrentPage(DeckPageType.LOSSES)
            updatingWinsAndLosses = winsPage != -1 || lossesPage != -1
        }

        if (updatingWinsAndLosses != true) return

        val winsPage = deckPageService.findCurrentPage(DeckPageType.WINS)
        val lossesPage = deckPageService.findCurrentPage(DeckPageType.LOSSES)

        if (winsPage == -1 && lossesPage == -1) {
            log.info("Not currently updating wins losses.")
            updatingWinsAndLosses = false
        }

        val page = if (winsPage != -1) winsPage else lossesPage
        val order = if (winsPage != -1) "-wins" else "-losses"
        val pageEnum = if (winsPage != -1) DeckPageType.WINS else DeckPageType.LOSSES

        try {
            val decks = keyforgeApi.findDecks(page, order, 25)
            val updateDecks = decks?.data?.filter { it.losses != 0 || it.wins != 0 || it.power_level != 0 }
            if (updateDecks.isNullOrEmpty()) {

                deckPageService.setCurrentPage(-1, pageEnum)
                if (winsPage == -1) {
                    log.info("Pages of wins losses: $lossesPage pageEnum: $pageEnum")
                    updatingWinsAndLosses = false
                    updateCardAndHouseWins()
                } else {
                    deckPageService.setCurrentPage(1, DeckPageType.LOSSES)
                }
                return
            }
            if (page % 100 == 0) log.info("Update $order for decks on page $page")
            updateDecks.forEach { saveDeckWins(it) }
            deckPageService.setCurrentPage(page + 1, pageEnum)

        } catch (e: HttpClientErrorException.TooManyRequests) {
            log.warn("KeyForge API says we made too many requests in deck win service. Sad day.")
        }
    }

    fun updateCardAndHouseWins() {
        log.info("$scheduledStart card and house win loss update")

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

        log.info("$scheduledStop It took ${updateCardAndHouseWinsLossesDuration / 1000} seconds to update wins and losses for cards and houses.")

    }

    private fun saveDeckWins(deck: KeyforgeDeck) {
        val preexisting = deckRepo.findByKeyforgeId(deck.id)
        if (preexisting != null) {
            val cards = cardService.cardsForDeck(preexisting)
            val updated = preexisting.withCards(cards).addGameStats(deck)

            if (updated != null) {
                deckRepo.save(updated)
            }
        }
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
