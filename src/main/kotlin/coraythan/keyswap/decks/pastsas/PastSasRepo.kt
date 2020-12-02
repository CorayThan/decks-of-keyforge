package coraythan.keyswap.decks.pastsas

import coraythan.keyswap.decks.models.PastSas
import org.springframework.data.repository.CrudRepository

interface PastSasRepo : CrudRepository<PastSas, Long> {
    fun findByDeckId(deckId: Long): List<PastSas>
}
