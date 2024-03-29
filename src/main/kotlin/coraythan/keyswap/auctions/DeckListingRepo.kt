package coraythan.keyswap.auctions

import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime
import java.util.*

interface DeckListingRepo : CrudRepository<DeckListing, UUID> {
    fun findAllByStatusEqualsAndEndDateTimeLessThanEqual(status: DeckListingStatus, endDateTimeLessThanOrEqualTo: ZonedDateTime): List<DeckListing>

    fun findAllBySellerIdAndStatus(sellerId: UUID, status: DeckListingStatus): List<DeckListing>
    fun existsBySellerIdAndStatus(sellerId: UUID, status: DeckListingStatus): Boolean
    fun findAllBySellerIdAndStatusNot(sellerId: UUID, status: DeckListingStatus): List<DeckListing>

    fun findBySellerIdAndDeckIdAndStatusNot(sellerId: UUID, deckId: Long, status: DeckListingStatus): List<DeckListing>
    fun findBySellerIdAndDeckId(sellerId: UUID, deckId: Long): List<DeckListing>
    fun existsBySellerIdAndDeckIdAndStatusNot(sellerId: UUID, deckId: Long, status: DeckListingStatus): Boolean

    fun findByDeckIdAndStatusNot(deckId: Long, status: DeckListingStatus): List<DeckListing>

    fun findByTagId(tagId: Long): List<DeckListing>
}
