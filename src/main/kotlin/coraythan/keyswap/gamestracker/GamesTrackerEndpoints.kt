package coraythan.keyswap.gamestracker

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/games-tracker")
class GamesTrackerEndpoints(
    private val gameTrackerService: GameTrackerService
) {

    @CrossOrigin
    @PostMapping("/report-game")
    fun reportGame(@RequestBody gameReport: GameReport) {
       gameTrackerService.saveGame(gameReport)
    }

    @PostMapping("/secured/search-games")
    fun searchGames(@RequestBody filter: GamesSearchFilters, @RequestHeader(value = "Timezone") offsetMinutes: Int): GamesSet {
        return gameTrackerService.searchGames(filter, offsetMinutes)
    }
}
