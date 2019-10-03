package coraythan.keyswap.spoilers

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("${Api.base}/spoilers")
class SpoilerEndpoints(
        private val spoilerService: SpoilerService
) {

    @GetMapping
    fun allSpoilers() = spoilerService.findSpoilers()

    @GetMapping("/{spoilerId}")
    fun findSpoiler(@PathVariable spoilerId: Long) = spoilerService.findSpoiler(spoilerId)

    @PostMapping("/secured")
    fun saveSpoiler(@RequestBody spoiler: Spoiler) = spoilerService.saveSpoiler(spoiler)

    @PostMapping("/secured/add-spoiler-image/{spoilerId}")
    fun addSpoilerImage(
            @RequestParam("spoilerImage") spoilerImage: MultipartFile,
            @PathVariable spoilerId: Long
    ) {
        return spoilerService.addSpoilerCard(spoilerImage, spoilerId)
    }

    @DeleteMapping("/secured/{id}")
    fun delete(@PathVariable id: Long) = spoilerService.deleteSpoiler(id)
}
