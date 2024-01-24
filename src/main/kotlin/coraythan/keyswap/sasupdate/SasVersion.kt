package coraythan.keyswap.sasupdate

import coraythan.keyswap.now
import jakarta.persistence.*
import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime

@Entity
data class SasVersion(

    @Enumerated(value = EnumType.STRING)
    val activeUpdateTable: SasVersionTableForUpdates,

    val version: Int,
    val createdTimestamp: ZonedDateTime = now(),

    /**
     * This represents that the sas scores have been completely updated for all decks in the update table,
     * but that table hasn't yet been activated.
     */
    val sasScoresUpdated: Boolean = false,

    /**
     * This is populated when this SAS version has been activated and is used in searching.
     */
    val sasUpdateCompletedTimestamp: ZonedDateTime? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "sas_version_sequence")
    @SequenceGenerator(name = "sas_version_sequence", allocationSize = 1)
    val id: Long = -1
)

interface SasVersionRepo : CrudRepository<SasVersion, Long> {
    fun findFirstBySasUpdateCompletedTimestampNotNullOrderByIdDesc(): SasVersion
    fun findFirstBySasUpdateCompletedTimestampNullOrderByIdDesc(): SasVersion?
    fun findFirstBySasUpdateCompletedTimestampNullAndSasScoresUpdatedTrueOrderByIdDesc(): SasVersion?
}

enum class SasVersionTableForUpdates {
    DSV1,
    DSV2,
}
