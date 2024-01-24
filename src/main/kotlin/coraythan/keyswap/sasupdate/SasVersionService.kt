package coraythan.keyswap.sasupdate

import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class SasVersionService(
    private val repo: SasVersionRepo,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private var sasVersion: Int = -1
    private var updating = false
    private var readyToActivateNewVersion = false

    @PostConstruct
    fun activateConfiguration() {
        val activeSasVersionConfiguration = repo.findFirstBySasUpdateCompletedTimestampNotNullOrderByIdDesc()
        val updatingSasVersion = repo.findFirstBySasUpdateCompletedTimestampNullOrderByIdDesc()
        log.info(
            "Active SAS Config $activeSasVersionConfiguration " +
                    "Updating SAS Config: $updatingSasVersion"
        )
        this.updating = updatingSasVersion != null
        this.sasVersion = activeSasVersionConfiguration.version
        this.readyToActivateNewVersion = updatingSasVersion != null && updatingSasVersion.sasScoresUpdated
    }

    fun setUpdatingAndSasVersion(updating: Boolean, sasVersion: Int, readyToUpdate: Boolean) {
        this.updating = updating
        this.sasVersion = sasVersion
        this.readyToActivateNewVersion = readyToUpdate
    }

    fun setReadyToActivateNewVersion(readyToUpdate: Boolean) {
        this.readyToActivateNewVersion = readyToUpdate
    }

    fun findSasVersion(): Int {
        if (sasVersion == -1) throw IllegalStateException("SAS Version not yet set")
        return sasVersion
    }

    fun isUpdating() = updating

    fun isReadyToActivateNewVersion() = readyToActivateNewVersion

}
