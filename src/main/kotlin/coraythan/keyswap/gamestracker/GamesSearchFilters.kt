package coraythan.keyswap.gamestracker

import coraythan.keyswap.generatets.GenerateTs
import java.time.LocalDate

@GenerateTs
data class GamesSearchFilters(
    val tcoPlayerName: String?,
    val deckId: String?,
    val startDate: LocalDate?,
    val stopDate: LocalDate?,
)
