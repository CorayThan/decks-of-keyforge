package coraythan.keyswap.tags

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/tags")
class TagEndpoints(
        private val tagService: TagService
) {

    @PostMapping("/secured/view/{id}")
    fun viewedTag(@PathVariable id: Long) = tagService.viewedTag(id)

    @PostMapping("/secured")
    fun createTag(@RequestBody createTag: CreateTag) = tagService.createTag(createTag)

    @PostMapping("/secured/{id}/update-publicity/{publicity}")
    fun updateTagPublicity(@PathVariable id: Long, @PathVariable publicity: PublicityType) = tagService.updateTagPublicityType(id, publicity)

    @GetMapping("/public")
    fun findPublicTags() = tagService.findPublicTags()

    @GetMapping("/secured/my-tags")
    fun findMyTags() = tagService.findMyTags()

    @GetMapping("/secured/my-deck-tags")
    fun findMyDeckTags() = tagService.findMyDeckTags()

    @PostMapping("/secured/tag/{tagId}/deck/{deckId}")
    fun tagDeck(@PathVariable deckId: Long, @PathVariable tagId: Long) = tagService.tagDeck(deckId, tagId)

    @DeleteMapping("/secured/tag/{tagId}/deck/{deckId}")
    fun untagDeck(@PathVariable deckId: Long, @PathVariable tagId: Long) = tagService.untagDeck(deckId, tagId)

    @DeleteMapping("/secured/{tagId}")
    fun deleteTag(@PathVariable tagId: Long) = tagService.deleteTag(tagId)

    @PostMapping("/secured/archive/{tagId}")
    fun archiveTag(@PathVariable tagId: Long) = tagService.archiveTag(tagId)

    @PostMapping("/tags-info")
    fun findTagInfo(@RequestBody tagIds: List<Long>) = tagService.findPublicTags()
}
