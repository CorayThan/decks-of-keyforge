package coraythan.keyswap.auctions

import org.springframework.data.repository.CrudRepository
import java.util.*

interface OfferRepo : CrudRepository<Offer, UUID>
