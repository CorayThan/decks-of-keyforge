package coraythan.keyswap.decks.theoreticaldecks

import org.springframework.data.repository.CrudRepository
import java.util.*

interface TheoreticalDeckRepo : CrudRepository<TheoreticalDeck, UUID> {
    fun findByCreatorIdAndAlliance(creatorId: UUID, alliance: Boolean): List<TheoreticalDeck>

    fun findTop25ByAllianceTrueAndConvertedToAllianceFalse(): List<TheoreticalDeck>
}
