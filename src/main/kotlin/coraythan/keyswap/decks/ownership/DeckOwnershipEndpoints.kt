package coraythan.keyswap.decks.ownership

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("${Api.base}/deck-ownership")
class DeckOwnershipEndpoints(
        private val deckOwnershipService: DeckOwnershipService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/secured/for-me")
    fun findDeckIdsForUser() = deckOwnershipService.findDeckIdsForUser()

    @GetMapping("/{id}")
    fun findForDeck(@PathVariable id: Long) = deckOwnershipService.findByDeckId(id)

    @PostMapping("/secured/{deckId}")
    fun addDeckVerificationImage(
            @RequestParam("deckImage") deckImage: MultipartFile,
            @PathVariable deckId: Long
    ) {
        return deckOwnershipService.addDeckOwnership(deckImage, deckId)
    }

    @DeleteMapping("/secured/{deckId}")
    fun deleteOwnership(@PathVariable deckId: Long) = deckOwnershipService.deleteDeckOwnershipAndS3Object(deckId)
}
