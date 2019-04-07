package coraythan.keyswap.patreon

import org.springframework.data.repository.CrudRepository
import java.util.*

interface PatreonAccountRepo : CrudRepository<PatreonAccount, UUID>