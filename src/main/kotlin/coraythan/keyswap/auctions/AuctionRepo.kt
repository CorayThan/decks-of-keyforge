package coraythan.keyswap.auctions

import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime
import java.util.*

interface AuctionRepo : CrudRepository<Auction, UUID> {
    fun findAllByStatusEqualsAndEndDateTimeLessThanEqual(status: AuctionStatus, endDateTimeLessThanOrEqualTo: ZonedDateTime): List<Auction>

    fun findAllBySellerIdAndStatus(sellerId: UUID, status: AuctionStatus): List<Auction>
}
