package coraythan.keyswap.imgs

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("${Api.base}/user-imgs")
class UserImgEndpoints(
        private val userImgService: UserImgService
) {

    @GetMapping("/secured/for-tag/{tag}")
    fun findMyImgsForTag(@PathVariable("tag") tag: UserImgTag) = userImgService.findMyImgsForTag(tag)

    @PostMapping("/secured/{tag}")
    fun addUserImg(
            @RequestParam("img")
            img: MultipartFile,

            @RequestHeader("Extension")
            extension: String,

            @PathVariable("tag")
            tag: UserImgTag,

            ) = userImgService.addUserImg(img, extension, tag)

    @DeleteMapping("/secured/{id}")
    fun deleteUserImg(@PathVariable("id") id: UUID) = userImgService.delete(id)
}
