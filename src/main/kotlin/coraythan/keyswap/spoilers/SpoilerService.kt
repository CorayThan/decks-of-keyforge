package coraythan.keyswap.spoilers

import coraythan.keyswap.config.S3Service
import coraythan.keyswap.toUrlFriendlyCardTitle
import coraythan.keyswap.users.CurrentUserService
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Transactional
@Service
class SpoilerService(
        private val spoilerRepo: SpoilerRepo,
        private val s3Service: S3Service,
        private val currentUserService: CurrentUserService

) {

    private var cachedSpoilers: List<Spoiler>? = null

    fun findSpoilers(): List<Spoiler> {
        val spoilers = this.cachedSpoilers
        if (spoilers == null) {
            val loadedSpoilers = spoilerRepo.findAll()
            this.cachedSpoilers = loadedSpoilers
            return loadedSpoilers
        }
        return spoilers
    }

    fun saveSpoiler(spoiler: Spoiler) {
        currentUserService.contentCreatorOrUnauthorized()
        spoilerRepo.save(spoiler)
        this.cachedSpoilers = null
    }

    fun addSpoilerCard(spoilerImage: MultipartFile, spoilerId: Long) {
        val spoiler = spoilerRepo.findByIdOrNull(spoilerId) ?: throw IllegalStateException("No spoiler for $spoilerId")
        val name = spoiler.cardTitle.toUrlFriendlyCardTitle()
        currentUserService.contentCreatorOrUnauthorized()
        s3Service.addSpoilerCard(spoilerImage, name, spoiler.expansion)
        spoilerRepo.save(spoiler.copy(frontImage = spoiler.expansion.toString() + "_" + name))
    }

}
