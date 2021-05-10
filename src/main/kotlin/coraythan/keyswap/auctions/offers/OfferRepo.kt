package coraythan.keyswap.auctions.offers

import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*

interface OfferRepo : CrudRepository<Offer, UUID> {
    fun findByRecipientId(id: UUID): List<Offer>
    fun findBySenderId(id: UUID): List<Offer>
    fun findByRecipientIdAndRecipientArchivedFalse(id: UUID): List<Offer>
    fun findBySenderIdAndSenderArchivedFalse(id: UUID): List<Offer>

    fun findByAuctionId(id: UUID): List<Offer>

    fun existsByRecipientIdAndViewedTimeIsNull(id: UUID): Boolean

    fun findByExpiresTimeBeforeAndStatus(before: LocalDateTime, notStatus: OfferStatus): List<Offer>
}
