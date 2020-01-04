package coraythan.keyswap.auctions.offers

import org.springframework.data.repository.CrudRepository
import java.util.*

interface OfferRepo : CrudRepository<Offer, UUID> {
    fun findByRecipientIdAndStatusIn(id: UUID, statuses: Set<OfferStatus>): List<Offer>
    fun findBySenderIdAndStatusIn(id: UUID, statuses: Set<OfferStatus>): List<Offer>

    fun existsByRecipientIdAndViewedTimeIsNull(id: UUID): Boolean
}
