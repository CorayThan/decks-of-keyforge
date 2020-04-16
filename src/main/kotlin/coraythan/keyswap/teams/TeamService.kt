package coraythan.keyswap.teams

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.EntityManager

@Service
@Transactional
class TeamService(
        private val teamRepo: TeamRepo,
        private val currentUserService: CurrentUserService,
        private val userRepo: KeyUserRepo,
        private val userDeckRepo: UserDeckRepo,
        val entityManager: EntityManager
) {

    private val teamNameRegex = "^[a-zA-Z0-9\\s',-]+$".toRegex()

    fun formOrUpdateTeam(nameParam: String) {
        val name = nameParam.trim()
        if (name.isBlank() || !name.matches(teamNameRegex)) throw BadRequestException("$name is invalid for a team name.")
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        if (teamRepo.findByName(name) != null) throw BadRequestException("Name taken.")
        val preexisting = teamRepo.findByTeamLeaderId(loggedInUser.id)
        if (preexisting == null) {
            if (loggedInUser.team != null) throw BadRequestException("Can't make a team when you're on a team.")
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
        val team = loggedInUser.team
        return if (team == null) {
            TeamOrInvites(invites = teamRepo.findByInvitesContains(loggedInUser.id).map { TeamInviteInfo(it.name, it.id) })
        } else {
            TeamOrInvites(team = TeamInfo(
                    name = team.name,
                    leader = team.members.find { it.id == team.teamLeaderId }?.username ?: "",
                    members = team.members.map { it.generateSearchResult() }.sortedBy { it.username },
                    invites = team.invites.map { userRepo.findByIdOrNull(it)!!.username }
            ), invites = listOf())
        }
    }

    fun leaveTeam() {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = loggedInUser.team ?: throw BadRequestException("No team for user ${loggedInUser.email}")

        removeFromTeamAndDecks(loggedInUser, team)
    }

    private fun addUserToTeam(toAdd: KeyUser, team: Team) {
        userRepo.save(toAdd.copy(team = team))
        userDeckRepo.addTeamForUser(team.id, toAdd.username)
        teamRepo.save(team.copy(invites = team.invites.minus(toAdd.id), members = team.members.plus(toAdd)))
    }

    fun disbandTeam() {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val team = teamRepo.findByTeamLeaderId(loggedInUser.id) ?: throw BadRequestException("No team for team leader ${loggedInUser.email}")
        if (team.members.size > 1) throw BadRequestException("Team too big to disband.")

        removeFromTeamAndDecks(loggedInUser, team)

        teamRepo.deleteById(team.id)
    }

    private fun removeFromTeamAndDecks(toRemove: KeyUser, team: Team) {
        userRepo.removeTeam(toRemove.id)
        userDeckRepo.removeTeamForUser(toRemove.username)

        teamRepo.save(team.copy(
                members = team.members.filter { it.id != toRemove.id }
        ))
    }
}
