package coraythan.keyswap.imgs

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.thirdpartyservices.S3Service
import coraythan.keyswap.users.CurrentUserService
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*

@Service
class UserImgService(
        private val repo: UserImgRepo,
        private val currentUserService: CurrentUserService,
        private val s3Service: S3Service
) {
    fun addUserImg(img: MultipartFile, extension: String, tag: UserImgTag) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val key = s3Service.addGenericUserImg(img, extension)
        repo.save(UserImg(
                imgName = key,
                tag = tag,
                userId = currentUser.id,
                id = UUID.randomUUID()
        ))
    }

    fun findMyImgsForTag(tag: UserImgTag): List<UserImg> {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return repo.findByUserIdAndTag(currentUser.id, tag).sortedBy { it.created }
    }

    fun delete(id: UUID) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val tag = repo.findByIdOrNull(id) ?: throw BadRequestException("No tag for id $id")
        if (currentUser.id != tag.userId) {
            throw UnauthorizedException("You don't own tag with id $id")
        }
        repo.deleteById(id)
    }

}
