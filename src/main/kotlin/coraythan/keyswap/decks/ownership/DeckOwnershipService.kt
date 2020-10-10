package coraythan.keyswap.decks.ownership

import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.thirdpartyservices.S3Service
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.users.CurrentUserService
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Transactional
@Service
class DeckOwnershipService(
        private val s3Service: S3Service,
        private val currentUserService: CurrentUserService,
        private val userDeckRepo: UserDeckRepo,
        private val deckOwnershipRepo: DeckOwnershipRepo,
        private val deckRepo: DeckRepo,
        private val deckListingRepo: DeckListingRepo
) {

    fun addDeckOwnership(deckImage: MultipartFile, deckId: Long, extension: String) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val deck = deckRepo.findByIdOrNull(deckId) ?: throw IllegalStateException("No deck with id $deckId")

        if (!userDeckRepo.existsByUserIdAndDeckId(currentUser.id, deckId)) {
            throw UnauthorizedException("You don't have this deck marked as owned.")
        }

        deleteDeckOwnership(deckId)

        val key = s3Service.addDeckImage(deckImage, deckId, currentUser.id, extension)

        val deckOwnership = DeckOwnership(deckId, currentUser, key)
        deckOwnershipRepo.save(deckOwnership)
        deckRepo.save(deck.copy(hasOwnershipVerification = true))

        deckListingRepo.findBySellerIdAndDeckId(currentUser.id, deckId)
                .forEach {
                    deckListingRepo.save(it.copy(hasOwnershipVerification = true))
                }
    }

    fun deleteDeckOwnershipAndS3Object(deckId: Long) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val ownership = deckOwnershipRepo.findByDeckIdAndUserId(deckId, currentUser.id) ?: return
        s3Service.deleteUserContent(ownership.key)
        deckOwnershipRepo.deleteAllByDeckIdAndUserId(deckId, currentUser.id)

        if (!deckOwnershipRepo.existsByDeckId(deckId)) {
            val deck = deckRepo.findByIdOrNull(deckId) ?: throw IllegalStateException("No deck with id $deckId")
            deckRepo.save(deck.copy(hasOwnershipVerification = false))
        }
        deckListingRepo.findBySellerIdAndDeckId(currentUser.id, deckId)
                .forEach {
                    deckListingRepo.save(it.copy(hasOwnershipVerification = false))
                }
    }

    private fun deleteDeckOwnership(deckId: Long) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        deckOwnershipRepo.deleteAllByDeckIdAndUserId(deckId, currentUser.id)
    }

    fun findByDeckId(id: Long): List<DeckOwnershipDto> {
        return deckOwnershipRepo.findByDeckId(id).sortedByDescending { it.uploadDateTime }.map { it.toDto() }
    }

    fun findDeckIdsForUser(): List<Long> {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return deckOwnershipRepo.findByUserId(currentUser.id).map { it.deckId }
    }

}
