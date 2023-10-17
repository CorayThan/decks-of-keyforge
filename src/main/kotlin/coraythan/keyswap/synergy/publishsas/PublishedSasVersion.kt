package coraythan.keyswap.synergy.publishsas

import coraythan.keyswap.now
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.time.ZonedDateTime
import java.util.*

@Entity
data class PublishedSasVersion(

    val version: Int,

    val majorVersion: Boolean = false,

    val published: ZonedDateTime = now(),

    @Id
    val id: UUID = UUID.randomUUID()
)