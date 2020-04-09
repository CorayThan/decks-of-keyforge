package coraythan.keyswap.teams

import org.springframework.data.repository.CrudRepository
import java.util.*

interface TeamRepo : CrudRepository<Team, UUID> {
    fun findByTeamLeaderId(id: UUID): Team?
    fun findByName(name: String): Team?
    fun findByInvitesContains(userId: UUID): List<Team>
}
