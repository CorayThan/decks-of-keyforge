package coraythan.keyswap.auctions

import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime
import java.util.*

interface AuctionRepo : CrudRepository<Auction, UUID> {
    fun findAllByStatusEqualsAndEndDateTimeLessThanEqual(status: AuctionStatus, endDateTimeLessThanOrEqualTo: ZonedDateTime): List<Auction>

    fun findAllBySellerIdAndStatus(sellerId: UUID, status: AuctionStatus): List<Auction>

    fun findBySellerIdAndDeckIdAndStatus(sellerId: UUID, deckId: Long, status: AuctionStatus): List<Auction>
    fun findBySellerIdAndDeckId(sellerId: UUID, deckId: Long): Auction?

    fun findByStatusIn(statuses: Set<AuctionStatus>): List<Auction>
}
