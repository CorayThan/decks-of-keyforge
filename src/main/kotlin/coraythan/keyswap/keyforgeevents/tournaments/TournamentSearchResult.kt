package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.keyforgeevents.KeyForgeEventDto
import java.time.LocalDateTime

@GenerateTs
data class TournamentSearchResult(
        val id: Long,
        val name: String,
        val private: Boolean,
        val ended: LocalDateTime?,
        val event: KeyForgeEventDto,
)