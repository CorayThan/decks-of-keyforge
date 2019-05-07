package coraythan.keyswap.stats

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.Wins
import coraythan.keyswap.decks.addWinsLosses
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.QDeck
import coraythan.keyswap.now
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import net.javacrumbs.shedlock.core.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.persistence.EntityManager
import kotlin.math.roundToInt
import kotlin.system.measureTimeMillis

private const val lockStatsVersionUpdate = "PT72H"
private const val lockUpdateStats = "PT10M"

@Transactional
@Service
class StatsService(
        private val cardService: CardService,
        private val deckStatisticsRepo: DeckStatisticsRepo,
        private val deckRepo: DeckRepo,
        entityManager: EntityManager
) {

    private val query = JPAQueryFactory(entityManager)
    private val log = LoggerFactory.getLogger(this::class.java)

    private var updateStats = true

    var cachedStats: DeckStatistics? = null
    var cachedGlobalStats: GlobalStats? = null
    val defaultGlobalStats = GlobalStats()

    fun findGlobalStats(): GlobalStats {
        if (cachedGlobalStats != null) {
            return cachedGlobalStats ?: defaultGlobalStats
        }
        this.updateCachedStats()
        return cachedGlobalStats ?: defaultGlobalStats
    }

    fun findCurrentStats(): DeckStatistics? {
        if (cachedStats != null) {
            return cachedStats
        }
        this.updateCachedStats()
        return cachedStats
    }

    fun setStats(deckStats: DeckStatistics) {
        val mostRecentVersion = deckStatisticsRepo.findFirstByOrderByVersionDesc()
        if (mostRecentVersion?.completeDateTime != null) {
            log.info("Setting deck stats manually.")
            deckStatisticsRepo.save(
                    DeckStatisticsEntity.fromDeckStatistics(deckStats)
                            .copy(version = mostRecentVersion.version + 1, completeDateTime = now())
            )
            updateStats = true
        updateCachedStats()
        } else {
            throw IllegalStateException("Can't set stats manually with no previous stats or while in progress.")
        }
    }

    @Scheduled(fixedDelayString = "PT12H", initialDelayString = SchedulingConfig.newDeckStatsInitialDelay)
    @SchedulerLock(name = "updateStatisticsVersion", lockAtLeastForString = lockStatsVersionUpdate, lockAtMostForString = lockStatsVersionUpdate)
    fun startNewDeckStats() {
        log.info("$scheduledStart start new deck stats.")
        val mostRecentVersion = deckStatisticsRepo.findFirstByOrderByVersionDesc()
        if (mostRecentVersion == null) {
            deckStatisticsRepo.save(DeckStatisticsEntity.fromDeckStatistics(DeckStatistics()))
            updateStats = true
        } else if (mostRecentVersion.completeDateTime != null) {
            log.info("Creating deck stats with new version.")
            deckStatisticsRepo.save(
                    DeckStatisticsEntity.fromDeckStatistics(DeckStatistics())
                            .copy(version = mostRecentVersion.version + 1)
            )
            updateStats = true
        }
        log.info("$scheduledStop starting new deck stats.")
    }

    @Scheduled(fixedDelayString = lockUpdateStats)
    @SchedulerLock(name = "updateStatistics", lockAtLeastForString = lockUpdateStats, lockAtMostForString = lockUpdateStats)
    fun updateStatsForDecks() {

        if (!updateStats) return

        log.info("$scheduledStart update stats for decks.")

        val millisTaken = measureTimeMillis {

            val stats = deckStatisticsRepo.findFirstByOrderByVersionDesc()

            when {
                stats == null -> log.warn("There was no stats version for updating deck stats.")
                stats.completeDateTime != null -> {
                    updateStats = false
                    log.info("Deck Stats were already completed updating for version ${stats.version}.")
                }
                else -> {
                    val deckQ = QDeck.deck
                    val predicate = BooleanBuilder()
                            .and(deckQ.registered.isTrue)
                            .andAnyOf(deckQ.statsVersion.isNull, deckQ.statsVersion.ne(stats.version))
                    val deckResults = query.selectFrom(deckQ)
                            .where(predicate)
                            .limit(1000)
                            .fetch()

                    if (deckResults.isEmpty()) {
                        updateStats = false
                        deckStatisticsRepo.save(stats.copy(completeDateTime = now()))
                        updateCachedStats()
                        log.info("Done updating deck stats! Final stats are: \n\n$stats\n\n")
                    }

                    updateStats(stats, deckResults)
                }
            }
        }
        if (updateStats) log.info("$scheduledStop Took $millisTaken ms to update stats with 1000 decks.")
    }

    private fun updateStats(statsEntity: DeckStatisticsEntity, decks: List<Deck>) {
        val stats = statsEntity.toDeckStatistics()
        decks.forEach { ratedDeck ->
            val cards = cardService.cardsForDeck(ratedDeck)

            stats.armorValues.incrementValue(ratedDeck.totalArmor)
            stats.totalCreaturePower.incrementValue(ratedDeck.totalPower)
            stats.aerc.incrementValue(ratedDeck.aercScore.roundToInt())
            stats.expectedAmber.incrementValue(ratedDeck.expectedAmber.roundToInt())
            stats.amberControl.incrementValue(ratedDeck.amberControl.roundToInt())
            stats.creatureControl.incrementValue(ratedDeck.creatureControl.roundToInt())
            stats.artifactControl.incrementValue(ratedDeck.artifactControl.roundToInt())
            stats.deckManipulation.incrementValue(ratedDeck.deckManipulation?.roundToInt() ?: 0)
            stats.effectivePower.incrementValue(ratedDeck.effectivePower ?: 0)
            stats.sas.incrementValue(ratedDeck.sasRating)
            stats.cardsRating.incrementValue(ratedDeck.cardsRating)
            stats.synergy.incrementValue(ratedDeck.synergyRating)
            stats.antisynergy.incrementValue(ratedDeck.antisynergyRating)
            stats.creatureCount.incrementValue(ratedDeck.creatureCount)
            stats.actionCount.incrementValue(ratedDeck.actionCount)
            stats.artifactCount.incrementValue(ratedDeck.artifactCount)
            stats.upgradeCount.incrementValue(ratedDeck.upgradeCount)

            val creatureCards = cards.filter { card -> card.cardType == CardType.Creature }
            stats.power2OrLower.incrementValue(creatureCards.filter { card -> card.power < 3 }.size)
            stats.power3OrLower.incrementValue(creatureCards.filter { card -> card.power < 4 }.size)
            stats.power3OrHigher.incrementValue(creatureCards.filter { card -> card.power > 2 }.size)
            stats.power4OrHigher.incrementValue(creatureCards.filter { card -> card.power > 3 }.size)
            stats.power5OrHigher.incrementValue(creatureCards.filter { card -> card.power > 4 }.size)

            if (ratedDeck.wins != 0 || ratedDeck.losses != 0) {
                val wins = Wins(ratedDeck.wins, ratedDeck.losses)
                stats.sasToWinsLosses.addWinsLosses(ratedDeck.sasRating, wins)
                stats.cardRatingsToWinsLosses.addWinsLosses(ratedDeck.cardsRating, wins)
                stats.synergyToWinsLosses.addWinsLosses(ratedDeck.synergyRating, wins)
                stats.antisynergyToWinsLosses.addWinsLosses(ratedDeck.antisynergyRating, wins)
                stats.aercToWinsLosses.addWinsLosses(ratedDeck.aercScore.roundToInt(), wins)
                stats.amberControlToWinsLosses.addWinsLosses(ratedDeck.amberControl.roundToInt(), wins)
                stats.expectedAmberToWinsLosses.addWinsLosses(ratedDeck.expectedAmber.roundToInt(), wins)
                stats.artifactControlToWinsLosses.addWinsLosses(ratedDeck.artifactControl.roundToInt(), wins)
                stats.creatureControlToWinsLosses.addWinsLosses(ratedDeck.creatureControl.roundToInt(), wins)
                stats.deckManipulationToWinsLosses.addWinsLosses(ratedDeck.deckManipulation?.roundToInt() ?: 0, wins)
                stats.effectivePowerToWinsLosses.addWinsLosses(ratedDeck.effectivePower ?: 0, wins)

                stats.creatureWins.addWinsLosses(ratedDeck.creatureCount, wins)
                stats.actionWins.addWinsLosses(ratedDeck.actionCount, wins)
                stats.artifactWins.addWinsLosses(ratedDeck.artifactCount, wins)
                stats.upgradeWins.addWinsLosses(ratedDeck.upgradeCount, wins)

                stats.raresWins.addWinsLosses(ratedDeck.raresCount, wins)
                ratedDeck.houses.forEach { house ->
                    stats.housesWins.addWinsLosses(house, wins)
                }
            }
        }

        deckRepo.saveAll(decks.map { it.copy(statsVersion = statsEntity.version) })
        deckStatisticsRepo.save(statsEntity.copy(deckStats = DeckStatisticsEntity.fromDeckStatistics(stats).deckStats))
    }

    private fun updateCachedStats() {
        cachedStats = deckStatisticsRepo.findFirstByCompleteDateTimeNotNullOrderByVersionDesc()?.toDeckStatistics() ?: DeckStatistics()
        cachedGlobalStats = cachedStats?.toGlobalStats() ?: GlobalStats()
    }
}