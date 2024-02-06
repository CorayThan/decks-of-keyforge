package coraythan.keyswap.alliancedecks

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
interface AllianceDeckRepo : JpaRepository<AllianceDeck, UUID>, QuerydslPredicateExecutor<AllianceDeck> {
    fun findFirst1ByHousesUniqueId(allianceHousesKey: String): List<AllianceDeck>
    fun findFirst1ByCheckedUniquenessFalse(): List<AllianceDeck>
    fun findFirst100ByUpdatedPipsFalse(): List<AllianceDeck>
}
