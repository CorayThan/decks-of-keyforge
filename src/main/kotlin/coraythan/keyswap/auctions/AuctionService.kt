package coraythan.keyswap.auctions

import coraythan.keyswap.users.CurrentUserService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AuctionService(
//        private val auctionRepo: AuctionRepo,
//        private val auctionBidRepo: AuctionBidRepo,
        private val currentUserService: CurrentUserService
) {


}