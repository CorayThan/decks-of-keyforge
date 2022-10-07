package coraythan.keyswap.gamestracker

import org.springframework.web.bind.annotation.*

//@RestController
//@RequestMapping("/games-tracker")
//class GamesTrackerEndpoints(
//    private val gameTrackerService: GameTrackerService
//) {
//
//    @CrossOrigin
//    @PostMapping("/report-game")
//    fun reportGame(@RequestBody gameReport: GameRecordDto) {
//       gameTrackerService.saveGame(gameReport)
//    }
//
//    @PostMapping("/search-games")
//    fun findGames(@RequestBody filter: GamesSearchFilters): GamesSet {
//        return gameTrackerService.findGames(filter)
//    }
//}