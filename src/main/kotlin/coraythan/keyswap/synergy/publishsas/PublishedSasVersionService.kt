package coraythan.keyswap.synergy.publishsas

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.models.doneRatingDecks
import coraythan.keyswap.users.CurrentUserService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PublishedSasVersionService(
    private val repo: PublishedSasVersionRepo,
    private val currentUserService: CurrentUserService,
) {

    private var cachedSasVersion: Int? = null
    private var majorVersion: Boolean = false

    fun latestSasVersion(): Int {
        return cachedSasVersion ?: return updateLatestVersion()
    }

    fun majorVersion() = majorVersion

    fun publishSas(majorVersion: Boolean) {
        currentUserService.adminOrUnauthorized()
        if (!doneRatingDecks) {
            throw BadRequestException("Currently rating decks.")
        }
        val lastVersionEntity = repo.findFirstByOrderByVersionDesc()
        val lastVersion = lastVersionEntity.version
        val nextVersion = lastVersion + 1
        repo.save(PublishedSasVersion(
            version = nextVersion,
            majorVersion = majorVersion,
        ))
        cachedSasVersion = nextVersion
    }

    private fun updateLatestVersion(): Int {
        val version = repo.findFirstByOrderByVersionDesc()
        majorVersion = version.majorVersion
        cachedSasVersion = version.version
        return version.version
    }

}
