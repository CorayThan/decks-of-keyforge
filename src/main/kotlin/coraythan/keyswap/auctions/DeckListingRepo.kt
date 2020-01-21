package coraythan.keyswap.auctions

import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime
import java.util.*

interface DeckListingRepo : CrudRepository<DeckListing, UUID> {
    fun findAllByStatusEqualsAndEndDateTimeLessThanEqual(status: DeckListingStatus, endDateTimeLessThanOrEqualTo: ZonedDateTime): List<DeckListing>

    fun findAllBySellerIdAndStatus(sellerId: UUID, status: DeckListingStatus): List<DeckListing>
    fun findAllBySellerIdAndStatusNot(sellerId: UUID, status: DeckListingStatus): List<DeckListing>

    fun findBySellerIdAndDeckIdAndStatusNot(sellerId: UUID, deckId: Long, status: DeckListingStatus): List<DeckListing>
    fun findBySellerIdAndDeckIdAndStatus(sellerId: UUID, deckId: Long, status: DeckListingStatus): List<DeckListing>

}
