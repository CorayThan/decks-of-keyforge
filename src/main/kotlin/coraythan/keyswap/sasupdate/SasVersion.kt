package coraythan.keyswap.sasupdate

import coraythan.keyswap.now
import jakarta.persistence.*
import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime

@Entity
data class SasVersion(

    @Enumerated(value = EnumType.STRING)
    val activeSearchTable: ActiveSasSearchTable,

    val version: Int,
    val createdTimestamp: ZonedDateTime = now(),
    val sasUpdateCompletedTimestamp: ZonedDateTime? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "sas_version_sequence")
    @SequenceGenerator(name = "sas_version_sequence", allocationSize = 1)
    val id: Long = -1
)

interface SasVersionRepo : CrudRepository<SasVersion, Long> {
    fun findFirstByOrderByIdDesc(): SasVersion
}

enum class ActiveSasSearchTable {
    DSV1,
    DSV2,
}
