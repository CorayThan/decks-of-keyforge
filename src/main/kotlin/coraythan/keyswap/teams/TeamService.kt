package coraythan.keyswap.teams

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.scheduledException
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.thirdpartyservices.S3Service
import coraythan.keyswap.userdeck.OwnedDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import coraythan.keyswap.users.search.lockUpdateUserSearchStatsFor
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.*
import javax.persistence.EntityManager

@Service
@Transactional
class TeamService(
        private val teamRepo: TeamRepo,
        private val currentUserService: CurrentUserService,
        private val userRepo: KeyUserRepo,
        private val s3Service: S3Service,
        private val ownedDeckRepo: OwnedDeckRepo,
        val entityManager: EntityManager,
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val teamNameRegex = "^[a-zA-Z0-9\\s',-]+$".toRegex()

    var allTeams: List<TeamName> = listOf()

    @Scheduled(fixedDelayString = lockUpdateUserSearchStatsFor, initialDelayString = SchedulingConfig.updateUserStatsInitialDelay)
    @SchedulerLock(name = "updateCachedTeams", lockAtLeastFor = lockUpdateUserSearchStatsFor, lockAtMostFor = lockUpdateUserSearchStatsFor)
    fun updateCachedTeamInfo() {
        try {
            log.info("$scheduledStart update cached teams.")

            allTeams = teamRepo.findAll()
                    .map { TeamName(it.id, it.name, it.teamImg, it.homepage, it.members.map { member -> member.username }) }

            log.info("$scheduledStop cached ${allTeams.size} teams")
        } catch (e: Throwable) {
            log.error("$scheduledException caching teams", e)
        }
    }

    fun formOrUpdateTeam(nameParam: String) {
        val name = nameParam.trim()
        if (name.isBlank() || !name.matches(teamNameRegex)) throw BadRequestException("$name is invalid for a team name.")
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        if (teamRepo.findByName(name) != null) throw BadRequestException("Name taken.")
        val preexisting = teamRepo.findByTeamLeaderId(loggedInUser.id)
        if (preexisting == null) {
            if (loggedInUser.teamId != null) throw BadRequestException("Can't make a team when you're on a team.")
            val saved = teamRepo.save(Team(name = name, teamLeaderId = loggedInUser.id))
            entityManager.flush()
            addUserToTeam(loggedInUser, saved)
        } else {
            teamRepo.save(preexisting.copy(name = name))
        }
    }

    fun inviteToTeam(usernameParam: String): Boolean {
        val username = usernameParam.trim()
        val userForUsername = userRepo.findByUsernameIgnoreCase(username) ?: return false

        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByTeamLeaderId(loggedInUser.id) ?: throw BadRequestException("No team for user ${loggedInUser.email}")
        teamRepo.save(team.copy(invites = team.invites.toSet().plus(userForUsername.id).toList()))
        return true
    }

    fun removeInvite(usernameParam: String) {
        val username = usernameParam.trim()
        val userForUsername = userRepo.findByUsernameIgnoreCase(username) ?: return

        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByTeamLeaderId(loggedInUser.id) ?: throw BadRequestException("No team for user ${loggedInUser.email}")

        teamRepo.save(team.copy(invites = team.invites.filter { it != userForUsername.id }))
    }

    fun removeFromTeam(username: String) {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByTeamLeaderId(loggedInUser.id) ?: throw BadRequestException("No teamm for team leader ${loggedInUser.email}")
        val toRemove = team.members.find { it.username == username }
        if (toRemove != null) {
            removeFromTeamAndDecks(toRemove, team)
        }
    }

    fun joinTeam(teamId: UUID) {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByIdOrNull(teamId) ?: throw BadRequestException("No team for id ${teamId}")
        if (!team.invites.contains(loggedInUser.id)) throw UnauthorizedException("Not allowed to join a team without an invite.")

        addUserToTeam(loggedInUser, team)
    }

    fun findTeamInfo(): TeamOrInvites? {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = if (loggedInUser.teamId == null) null else teamRepo.findByIdOrNull(loggedInUser.teamId)
        return if (team == null) {
            TeamOrInvites(invites = teamRepo.findByInvitesContains(loggedInUser.id).map { TeamInviteInfo(it.name, it.id) })
        } else {
            TeamOrInvites(team = TeamInfo(
                    name = team.name,
                    leader = team.members.find { it.id == team.teamLeaderId }?.username ?: "",
                    members = team.members.map {
                        val decks = ownedDeckRepo.findAllByOwnerId(it.id).map { it.deck }
                        it.generateSearchResult(decks)
                    }.sortedBy { it.username },
                    invites = team.invites.map { userRepo.findByIdOrNull(it)!!.username },
                    teamImg = team.teamImg,
                    homepage = team.homepage,
            ), invites = listOf())
        }
    }

    fun leaveTeam() {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val teamId = loggedInUser.teamId ?: throw BadRequestException("No team for user ${loggedInUser.email}")
        val team = teamRepo.findByIdOrNull(teamId) ?: throw BadRequestException("No team for id ${teamId}")
        removeFromTeamAndDecks(loggedInUser, team)
    }

    fun addTeamImg(img: MultipartFile, extension: String) {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByTeamLeaderId(loggedInUser.id) ?: throw BadRequestException("No team for user ${loggedInUser.email}")

        if (team.teamImg != null) {
            s3Service.deleteUserContent(team.teamImg)
        }

        val key = s3Service.addTeamImg(img, extension, team.id)

        teamRepo.save(team.copy(teamImg = key))
    }

    fun updateHomepage(homepage: String) {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByTeamLeaderId(loggedInUser.id) ?: throw BadRequestException("No team for user ${loggedInUser.email}")

        teamRepo.save(team.copy(homepage = homepage.trim()))
    }

    fun disbandTeam() {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByTeamLeaderId(loggedInUser.id) ?: throw BadRequestException("No team for team leader ${loggedInUser.email}")
        if (team.members.size > 1) throw BadRequestException("Team too big to disband.")

        removeFromTeamAndDecks(loggedInUser, team)

        teamRepo.deleteById(team.id)
    }

    private fun addUserToTeam(toAdd: KeyUser, team: Team) {
        userRepo.save(toAdd.copy(teamId = team.id))
        ownedDeckRepo.addTeamForUser(team.id, toAdd.id)
        teamRepo.save(team.copy(invites = team.invites.minus(toAdd.id), members = team.members.plus(toAdd)))
    }

    private fun removeFromTeamAndDecks(toRemove: KeyUser, team: Team) {
        userRepo.removeTeam(toRemove.id)
        ownedDeckRepo.removeTeamForUser(toRemove.id)

        teamRepo.save(team.copy(
                members = team.members.filter { it.id != toRemove.id }
        ))
    }
}
