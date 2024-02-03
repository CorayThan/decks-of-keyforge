package coraythan.keyswap.sasupdate

import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.deckimports.DeckCreationService
import coraythan.keyswap.decks.*
import coraythan.keyswap.decks.models.DeckSasValuesUpdatable
import coraythan.keyswap.now
import coraythan.keyswap.users.CurrentUserService
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.system.measureTimeMillis

private const val lockUpdateRatings = "PT10S"
private const val lockCheckToPublishSAS = "PT3H"

@Transactional
@Service
class DeckSasUpdateService(
    private val deckSasValuesUpdatableRepo: DeckSasValuesUpdatableRepo,
    private val deckPageService: DeckPageService,
    private val sasVersionService: SasVersionService,
    private val cardService: CardService,
    private val deckCreationService: DeckCreationService,
    private val sasVersionRepo: SasVersionRepo,
    private val currentUserService: CurrentUserService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun publishNewSasUpdate(): Int {
        currentUserService.adminOrUnauthorized()
        val nextVersion = sasVersionService.findSasVersion() + 1
        log.info("SAS Update: Publishing $nextVersion of SAS.")
        cardService.publishNextInfo(nextVersion)
        deckPageService.setCurrentPage(0, DeckPageType.RATING)

        val updatingSasVersion = sasVersionRepo.findFirstBySasUpdateCompletedTimestampNullOrderByIdDesc()
        val updating = sasVersionService.isUpdating()
        if (updating || updatingSasVersion != null) {
            throw IllegalStateException(
                "Cannot start SAS update when one is currently underway. updating $updating " +
                        "config: $updatingSasVersion"
            )
        }

        val currentConfig = sasVersionRepo.findFirstBySasUpdateCompletedTimestampNotNullOrderByIdDesc()

        val nextSearchTable = when (currentConfig.activeUpdateTable) {
            SasVersionTableForUpdates.DSV1 -> SasVersionTableForUpdates.DSV2
            SasVersionTableForUpdates.DSV2 -> SasVersionTableForUpdates.DSV1
        }

        val nextConfig = SasVersion(
            activeUpdateTable = nextSearchTable,
            version = nextVersion,
        )

        when (nextSearchTable) {
            SasVersionTableForUpdates.DSV1 -> deckSasValuesUpdatableRepo.dropIndexesFromTable1()
            SasVersionTableForUpdates.DSV2 -> deckSasValuesUpdatableRepo.dropIndexesFromTable2()
        }

        sasVersionRepo.save(nextConfig)
        sasVersionService.setUpdatingAndSasVersion(true, nextVersion, false)

        log.info("SAS Update: Published next version of SAS with config $nextConfig")
        return nextVersion
    }

    @SchedulerLock(
        name = "updateSasRatings",
        lockAtLeastFor = lockUpdateRatings,
        lockAtMostFor = lockUpdateRatings
    )
    @Scheduled(fixedDelayString = lockUpdateRatings, initialDelayString = SchedulingConfig.rateDecksInitialDelay)
    fun continueUpdatingSasValues() {
        if (sasVersionService.isUpdating() && !sasVersionService.isReadyToActivateNewVersion()) {

            val updateVersion = sasVersionService.findUpdatingSasVersion()

            val currentPage: Int
            val dsvForPage: DeckSasUpdatableValuesResult
            val updatedDsv: List<DeckSasValuesUpdatable>
            val msToUpdateSAS = measureTimeMillis {

                currentPage = deckPageService.findCurrentPage(DeckPageType.RATING)
                dsvForPage = deckPageService.deckSasUpdatableValuesForPage(currentPage, DeckPageType.RATING)

                updatedDsv = dsvForPage.decks
                    .mapNotNull {
                        val ratedDeck = deckCreationService.rateDeck(it.deck)
                        val ratingsEqual = it.sasValuesChanged(ratedDeck, updateVersion)
                        if (ratingsEqual) null else it
                    }

                deckSasValuesUpdatableRepo.saveAll(updatedDsv)
            }

            if (!dsvForPage.moreResults) {

                val sasVersion = this.sasVersionRepo.findFirstBySasUpdateCompletedTimestampNullOrderByIdDesc()
                    ?: throw IllegalStateException("SAS Update: No in progress SAS version to set scores as ready in")
                if (!sasVersion.sasScoresUpdated) {
                    log.info("SAS Update: Updating sas version to scores updated true")
                    this.sasVersionRepo.save(sasVersion.copy(sasScoresUpdated = true))
                }

                this.sasVersionService.setReadyToActivateNewVersion(true)
                log.info("SAS Update: Ready to Activate New Version. Page $currentPage update complete. Updated ${updatedDsv.size}. ${msToUpdateSAS}ms to update.")
            } else {
                deckPageService.setCurrentPage(currentPage + 1, DeckPageType.RATING)
                log.info("SAS Update: Page $currentPage update complete. Checked update for ${dsvForPage.decks.size}. Updated ${updatedDsv.size}. ${msToUpdateSAS}ms to update. Continuing to update")
            }
        }
    }

    @SchedulerLock(
        name = "activateNewSas",
        lockAtLeastFor = lockCheckToPublishSAS,
        lockAtMostFor = lockCheckToPublishSAS
    )
    @Scheduled(
        fixedDelayString = lockCheckToPublishSAS,
        initialDelayString = SchedulingConfig.publishNewSasInitialDelay
    )
    fun activateSasUpdate() {

        val updatingSasVersion =
            sasVersionRepo.findFirstBySasUpdateCompletedTimestampNullAndSasScoresUpdatedTrueOrderByIdDesc()
        log.info("SAS Update: Check if time to activate new SAS version with $updatingSasVersion")

        if (updatingSasVersion != null) {
            log.info("SAS Update: Found complete SAS update to activate. $updatingSasVersion")

            when (updatingSasVersion.activeUpdateTable) {
                SasVersionTableForUpdates.DSV1 -> deckSasValuesUpdatableRepo.addIndexesToTable1()
                SasVersionTableForUpdates.DSV2 -> deckSasValuesUpdatableRepo.addIndexesToTable2()
            }

            log.info("SAS Update: Added Indexes")

            val updated = sasVersionRepo.save(
                updatingSasVersion.copy(
                    sasUpdateCompletedTimestamp = now(),
                )
            )

            deckSasValuesUpdatableRepo.swapSearchAndUpdateTables()

            sasVersionService.setUpdatingAndSasVersion(false, updatingSasVersion.version, false)

            log.info("SAS Update: Complete! Switched from $updatingSasVersion to $updated")
        }

    }

}
