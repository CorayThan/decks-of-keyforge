package coraythan.keyswap.synergy.publishsas

import org.springframework.data.repository.CrudRepository
import java.util.*

interface PublishedSasVersionRepo : CrudRepository<PublishedSasVersion, UUID> {
    fun findFirstByOrderByVersionDesc(): PublishedSasVersion
}
