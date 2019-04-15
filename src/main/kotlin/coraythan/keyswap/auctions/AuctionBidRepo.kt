package coraythan.keyswap.auctions

import org.springframework.data.repository.CrudRepository
import java.util.*

interface AuctionBidRepo : CrudRepository<AuctionBid, UUID>