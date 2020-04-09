package coraythan.keyswap.teams

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/teams/secured")
class TeamEndpoints(
        private val teamService: TeamService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/{name}")
    fun formOrUpdate(@PathVariable name: String) = teamService.formOrUpdateTeam(name)

    @PostMapping("/invite/{username}")
    fun inviteToTeam(@PathVariable username: String) = teamService.inviteToTeam(username)

    @PostMapping("/remove/{username}")
    fun removeFromTeam(@PathVariable username: String) = teamService.removeFromTeam(username)

    @PostMapping("/remove-invite/{username}")
    fun removeInvite(@PathVariable username: String) = teamService.removeInvite(username)

    @PostMapping("/join/{teamId}")
    fun joinTeam(@PathVariable teamId: UUID) = teamService.joinTeam(teamId)

    @PostMapping("/disband")
    fun disbandTeam() = teamService.disbandTeam()

    @PostMapping("/leave")
    fun leaveTeam() = teamService.leaveTeam()

    @GetMapping
    fun findTeamInfo() = teamService.findTeamInfo()

}
