package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.Api
import coraythan.keyswap.keyforgeevents.KeyForgeEventDto
import coraythan.keyswap.keyforgeevents.KeyForgeEventFilters
import coraythan.keyswap.keyforgeevents.tournamentdecks.TournamentPairingPlayers
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/tournaments")
class TournamentEndpoints(
        private val tournamentService: TournamentService
) {

    @PostMapping("/search")
    fun searchTournaments(@RequestBody filters: KeyForgeEventFilters) = tournamentService.searchTournaments(filters)

    @GetMapping("/{id}")
    fun findTourneyInfo(@PathVariable id: Long) = tournamentService.findTourneyInfo(id)

    @PostMapping("/secured/{id}/{privateTournament}")
    fun createTourneyForEvent(@PathVariable id: Long, @PathVariable privateTournament: Boolean) = tournamentService.createTourneyForEvent(id, privateTournament)

    @PostMapping("/secured")
    fun createTourneyWithPrivateEvent(@RequestBody event: KeyForgeEventDto) = tournamentService.createTourneyWithPrivateEvent(event)

    @DeleteMapping("/secured/{id}")
    fun deleteTournament(@PathVariable id: Long) = tournamentService.deleteTournament(id)

    @PostMapping("/secured/{id}/pair-next-round")
    fun pairNextRound(@PathVariable id: Long, @RequestBody manualPairings: List<TournamentPairingPlayers>? = null) =
            tournamentService.pairNextRound(id, manualPairings)

    @PostMapping("/secured/{id}/start-current-round")
    fun startCurrentRound(@PathVariable id: Long) = tournamentService.startCurrentRound(id)

    @PostMapping("/secured/{id}/end-tournament/{end}")
    fun endTournament(@PathVariable id: Long, @PathVariable end: Boolean) = tournamentService.endTournament(id, end)

    @PostMapping("/secured/{id}/add-deck/{deckId}/{username}")
    fun addDeck(@PathVariable id: Long, @PathVariable deckId: String, @PathVariable username: String) = tournamentService.addDeck(id, deckId, username)

    @PostMapping("/secured/{id}/remove-deck/{tournamentDeckId}")
    fun removeDeck(@PathVariable id: Long, @PathVariable tournamentDeckId: Long) = tournamentService.removeDeck(id, tournamentDeckId)

    @PostMapping("/secured/{id}/add-to/{username}")
    fun addTo(@PathVariable id: Long, @PathVariable username: String) = tournamentService.addTo(id, username)

    @PostMapping("/secured/{id}/remove-to/{username}")
    fun removeTo(@PathVariable id: Long, @PathVariable username: String) = tournamentService.removeTo(id, username)

    @PostMapping("/secured/{id}/add-participant/{username}")
    fun addParticipant(@PathVariable id: Long, @PathVariable username: String) = tournamentService.addParticipant(id, username)

    @PostMapping("/secured/{id}/drop-participant/{username}/{drop}")
    fun dropParticipant(@PathVariable id: Long, @PathVariable username: String, @PathVariable drop: Boolean) = tournamentService.dropParticipant(id, username, drop)

    @PostMapping("/secured/{id}/verify-participant/{username}/{verify}")
    fun verifyParticipant(@PathVariable id: Long, @PathVariable username: String, @PathVariable verify: Boolean) = tournamentService.verifyParticipant(id, username, verify)

    @PostMapping("/secured/report-results")
    fun reportResults(@RequestBody results: TournamentResults) = tournamentService.reportResults(results)

    @PostMapping("/secured/{id}/lock-registration/{lock}")
    fun lockRegistration(@PathVariable id: Long, @PathVariable lock: Boolean) = tournamentService.lockRegistration(id, lock)

    @PostMapping("/secured/{id}/toggle-private/{privateTourney}")
    fun togglePrivate(@PathVariable id: Long, @PathVariable privateTourney: Boolean) = tournamentService.togglePrivate(id, privateTourney)

    @PostMapping("/secured/{id}/lock-deck-registration/{lock}")
    fun lockDeckRegistration(@PathVariable id: Long, @PathVariable lock: Boolean) = tournamentService.lockDeckRegistration(id, lock)

    @PostMapping("/secured/{id}/change-pairing-strategy/{strategy}")
    fun changePairingStrategy(@PathVariable id: Long, @PathVariable strategy: PairingStrategy) = tournamentService.changingPairingStrategy(id, strategy)

    @PostMapping("/secured/{id}/extend-by-minutes/{minutes}")
    fun extendCurrentRound(@PathVariable id: Long, @PathVariable minutes: Int) = tournamentService.extendCurrentRound(id, minutes)

    @PostMapping("/secured/{id}/change-tournament-participant/{previousUsername}/{newUsername}")
    fun changeTournamentParticipant(@PathVariable id: Long, @PathVariable previousUsername: String, @PathVariable newUsername: String) =
            tournamentService.changeTournamentParticipant(id, previousUsername, newUsername)


}
