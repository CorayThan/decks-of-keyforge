package coraythan.keyswap.decks

import coraythan.keyswap.decks.models.DeckSearchValues1
import coraythan.keyswap.decks.models.DeckSearchValues2
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.system.measureTimeMillis

@Transactional
@Service
class DeckSasUpdateService(
    private val deckSearchValues1Repo: DeckSearchValues1Repo,
    private val deckSearchValues2Repo: DeckSearchValues2Repo,
    private val deckRepo: DeckRepo,
    private val deckPageService: DeckPageService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    var deckSearchValuesUpdateCount = 0

//    @Scheduled(fixedDelayString = "PT1H", initialDelayString = "PT20S")
    fun addAndDropIndexes() {
        log.info("Began adding dsv1 indexes.")
        val msAddingIndexes = measureTimeMillis {
            deckSearchValues1Repo.addIndexes()
        }
        log.info("Adding deck search value 1 indexes took ${msAddingIndexes}ms")
    }

    var dsv1Count = -1L

     @Scheduled(fixedDelayString = "PT1S", initialDelayString = "PT15S")
    fun updateDeckSearchValuesInDecks() {
        val currentPage: Int
        val deckCount: Int
        val toUpdate: List<DeckSearchValues1>
        val toUpdate2: List<DeckSearchValues2>
        val moreDecks: Boolean

        val msTakenCounting = measureTimeMillis {

            if (dsv1Count < 1L) {
                dsv1Count = deckSearchValues1Repo.count()
            }
            if (dsv1Count == 0L) {
                deckPageService.setCurrentPage(0, DeckPageType.SEARCH_VALUES)
            }
        }
        val msTakenFindingDecks = measureTimeMillis {
            currentPage = deckPageService.findCurrentPage(DeckPageType.SEARCH_VALUES)
            val deckResults = deckPageService.decksForPage(currentPage, DeckPageType.SEARCH_VALUES)
            deckCount = deckResults.decks.size
            toUpdate = deckResults.decks
                .map { DeckSearchValues1(it) }
            toUpdate2 = deckResults.decks
                .map { DeckSearchValues2(it) }
            moreDecks = deckResults.moreResults
        }

        val msTakenSaving = measureTimeMillis {
            if (toUpdate.isNotEmpty()) {
                deckSearchValues1Repo.saveAll(toUpdate)
                deckSearchValues2Repo.saveAll(toUpdate2)
                dsv1Count += toUpdate.size
            }
            if (moreDecks) {
                deckPageService.setCurrentPage(currentPage + 1, DeckPageType.SEARCH_VALUES)
            }
        }

        log.info(
            "Updating deck search values. Found $deckCount decks from page $currentPage. " +
                    "Created ${toUpdate.size} search values. " +
                    "$dsv1Count search values created in total. " +
                    "Took ${msTakenCounting + msTakenFindingDecks + msTakenSaving} overall. " +
                    "Counting time: $msTakenCounting finding time: $msTakenFindingDecks saving time: $msTakenSaving"
        )
    }

}
