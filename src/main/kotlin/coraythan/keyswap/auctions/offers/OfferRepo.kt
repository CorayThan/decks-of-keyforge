package coraythan.keyswap.auctions.offers

import org.springframework.data.repository.CrudRepository
import java.util.*

interface OfferRepo : CrudRepository<Offer, UUID> {
    fun findByRecipientId(id: UUID): List<Offer>
    fun findBySenderId(id: UUID): List<Offer>

    fun findByAuctionId(id: UUID): List<Offer>

    fun existsByRecipientIdAndViewedTimeIsNull(id: UUID): Boolean
}
