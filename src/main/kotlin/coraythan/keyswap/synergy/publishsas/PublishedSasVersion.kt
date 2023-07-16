package coraythan.keyswap.synergy.publishsas

import coraythan.keyswap.now
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class PublishedSasVersion(

    val version: Int,

    val majorVersion: Boolean = false,

    val published: ZonedDateTime = now(),

    @Id
    val id: UUID = UUID.randomUUID()
)