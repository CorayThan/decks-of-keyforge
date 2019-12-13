package coraythan.keyswap.auctions

import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.salenotifications.ForSaleNotificationsService
import coraythan.keyswap.userdeck.UpdatePrice
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class SellerService(
        private val currentUserService: CurrentUserService,
        private val userRepo: KeyUserRepo,
        private val deckRepo: DeckRepo,
        private val userDeckRepo: UserDeckRepo,
        private val forSaleNotificationsService: ForSaleNotificationsService,
        private val auctionRepo: AuctionRepo
) {
    fun updatePrices(prices: List<UpdatePrice>) {
        for (price in prices) {
            val currentUser = currentUserService.loggedInUserOrUnauthorized()
            val preexisting = auctionRepo.findBySellerIdAndDeckId(currentUser.id, price.deckId)
                    ?: throw IllegalArgumentException("There was no listing info for deck with id ${price.deckId}")
            auctionRepo.save(preexisting.copy(buyItNow = price.askingPrice))
        }
    }
}