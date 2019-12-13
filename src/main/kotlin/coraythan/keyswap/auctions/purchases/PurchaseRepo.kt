package coraythan.keyswap.auctions.purchases

import org.springframework.data.repository.CrudRepository
import java.util.*

interface PurchaseRepo : CrudRepository<Purchase, UUID>
