package coraythan.keyswap.deckimports

import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import jakarta.persistence.Entity
import jakarta.persistence.Id
import org.slf4j.LoggerFactory
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

private const val lockImportSkippedDecksFor = "PT3M"

@Transactional
@Service
class ImportSkippedDecksService(
    private val repo: ImportSkippedDeckRepo,
    private val deckImporterService: DeckImporterService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedDelayString = "PT3M", initialDelayString = SchedulingConfig.postProcessDecksDelay)
    fun processSkippedDecks() {
        log.info("$scheduledStart Process import skipped decks.")

        val process = repo.findAllLimit1()

        val processed = mutableListOf<UUID>()

        for (toProcess in process) {
            deckImporterService.importDeck(toProcess.deckKeyforgeId)
        }

        processed.forEach {
            repo.deleteById(it)
        }

        log.info("$scheduledStop Imported ${processed.size} skipped decks.")
    }

    fun addImportSkippedDeck(keyforgeId: String) {
        if (!repo.existsByDeckKeyforgeId(keyforgeId)) {
            repo.save(ImportSkippedDeck(keyforgeId))
        }
    }
}

@Entity
data class ImportSkippedDeck(

    val deckKeyforgeId: String,

    @Id
    val id: UUID = UUID.randomUUID()
)

interface ImportSkippedDeckRepo : CrudRepository<ImportSkippedDeck, UUID> {
    @Query("SELECT * FROM import_skipped_deck LIMIT 1", nativeQuery = true)
    fun findAllLimit1(): List<ImportSkippedDeck>
    fun existsByDeckKeyforgeId(deckKeyforgeId: String): Boolean
}
