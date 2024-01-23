package coraythan.keyswap.sasupdate

import coraythan.keyswap.decks.DeckSearchValues1Repo
import coraythan.keyswap.decks.DeckSearchValues2Repo
import coraythan.keyswap.now
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class SasVersionService(
    private val repo: SasVersionRepo,
    private val deckSearchValues1Repo: DeckSearchValues1Repo,
    private val deckSearchValues2Repo: DeckSearchValues2Repo,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private lateinit var activeConfig: ActiveSasSearchTable
    private var sasVersion: Int = -1
    private var updating = false

    @PostConstruct
    fun activateConfiguration() {
        val activeSasConfiguration = repo.findFirstByOrderByIdDesc()
        log.info(
            "Active SAS Configuration set as ${activeSasConfiguration.activeSearchTable}. " +
                    "SAS Update started at: ${activeSasConfiguration.createdTimestamp} " +
                    "completed: ${activeSasConfiguration.sasUpdateCompletedTimestamp}"
        )
        updateSasConfigValues(activeSasConfiguration)
    }

    fun sasUpdateCompleteSwapSearchTables(swapTo: ActiveSasSearchTable) {

        log.info("SAS Update: Swapping to active search table: $swapTo")
        val activeSasUpdateConfig = repo.findFirstByOrderByIdDesc()
        if (activeSasUpdateConfig.activeSearchTable == swapTo) {
            throw IllegalStateException("Cannot swap to $swapTo while already using that table $activeSasUpdateConfig")
        }

        if (swapTo == ActiveSasSearchTable.DSV1) {
            deckSearchValues1Repo.addIndexes()
        } else {
            deckSearchValues2Repo.addIndexes()
        }
        val updated = repo.save(
            activeSasUpdateConfig.copy(
                activeSearchTable = swapTo,
                sasUpdateCompletedTimestamp = now(),
            )
        )
        this.updateSasConfigValues(updated)
        if (swapTo == ActiveSasSearchTable.DSV1) {
            deckSearchValues2Repo.dropIndexes()
        } else {
            deckSearchValues1Repo.dropIndexes()
        }

        log.info("SAS Update: Complete! Switched from $activeSasUpdateConfig to $updated")
    }

    fun findSasVersion(): Int {
        if (sasVersion == -1) throw IllegalStateException("SAS Version not yet set")
        return sasVersion
    }

    fun isUpdating() = updating

    fun findActiveSasSearchTable(): ActiveSasSearchTable = activeConfig

    fun updateSasConfigValues(sasUpdateConfiguration: SasVersion) {
        activeConfig = sasUpdateConfiguration.activeSearchTable
        sasVersion = sasUpdateConfiguration.version
        updating = sasUpdateConfiguration.sasUpdateCompletedTimestamp == null
    }
}
