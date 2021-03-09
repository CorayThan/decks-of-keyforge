package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class TournamentResults(
        val pairingId: Long,
        val winnerId: Long,
        val winnerKeys: Int,
        val loserKeys: Int,
)
