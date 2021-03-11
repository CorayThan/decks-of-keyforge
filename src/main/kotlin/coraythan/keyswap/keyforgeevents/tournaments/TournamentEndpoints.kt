package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/tournaments")
class TournamentEndpoints(
        private val tournamentService: TournamentService
) {

    @GetMapping("/{id}")
    fun findTourneyInfo(@PathVariable id: Long) = tournamentService.findTourneyInfo(id)

    @PostMapping("/secured/{id}/{privateTournament}")
    fun createTourneyForEvent(@PathVariable id: Long, @PathVariable privateTournament: Boolean) = tournamentService.createTourneyForEvent(id, privateTournament)

    @PostMapping("/secured/{id}/pair-next-round")
    fun pairNextRound(@PathVariable id: Long) = tournamentService.pairNextRound(id)

    @PostMapping("/secured/{id}/start-current-round")
    fun startCurrentRound(@PathVariable id: Long) = tournamentService.startCurrentRound(id)

    @PostMapping("/secured/{id}/end-tournament")
    fun endTournament(@PathVariable id: Long) = tournamentService.endTournament(id)

    @PostMapping("/secured/{id}/add-participant/{username}")
    fun addParticipant(@PathVariable id: Long, @PathVariable username: String) = tournamentService.addParticipant(id, username)

    @PostMapping("/secured/{id}/drop-participant/{username}")
    fun dropParticipant(@PathVariable id: Long, @PathVariable username: String) = tournamentService.dropParticipant(id, username)

    @PostMapping("/secured/report-results")
    fun reportResults(@RequestBody results: TournamentResults) = tournamentService.reportResults(results)
}
