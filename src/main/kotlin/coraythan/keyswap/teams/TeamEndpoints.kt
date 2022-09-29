package coraythan.keyswap.teams

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.http.CacheControl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("${Api.base}/teams")
class TeamEndpoints(
    private val teamService: TeamService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/all")
    fun findTeamNames(): ResponseEntity<List<TeamName>> {
        return ResponseEntity.ok().cacheControl(
            CacheControl
                .maxAge(10, TimeUnit.MINUTES)
        ).body(teamService.allTeams)
    }

    @PostMapping("/secured/{name}")
    fun formOrUpdate(@PathVariable name: String) = teamService.formOrUpdateTeam(name)

    @PostMapping("/secured/invite/{username}")
    fun inviteToTeam(@PathVariable username: String) = teamService.inviteToTeam(username)

    @PostMapping("/secured/remove/{username}")
    fun removeFromTeam(@PathVariable username: String) = teamService.removeFromTeam(username)

    @PostMapping("/secured/remove-invite/{username}")
    fun removeInvite(@PathVariable username: String) = teamService.removeInvite(username)

    @PostMapping("/secured/join/{teamId}")
    fun joinTeam(@PathVariable teamId: UUID) = teamService.joinTeam(teamId)

    @PostMapping("/secured/disband")
    fun disbandTeam() = teamService.disbandTeam()

    @PostMapping("/secured/leave")
    fun leaveTeam() = teamService.leaveTeam()

    @GetMapping("/secured")
    fun findTeamInfo() = teamService.findTeamInfo()

    @PostMapping("/secured/add-img")
    fun addTeamImg(
        @RequestParam("img")
        img: MultipartFile,

        @RequestHeader("Extension")
        extension: String,

        ) = teamService.addTeamImg(img, extension)

    @PostMapping("/secured/homepage")
    fun updateHomepage(@RequestBody homepage: TeamHomepage) = teamService.updateHomepage(homepage.homepage)
}

data class TeamHomepage(val homepage: String)
