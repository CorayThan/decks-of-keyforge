package coraythan.keyswap.tags

import org.springframework.data.repository.CrudRepository

interface DeckTagRepo : CrudRepository<DeckTag, Long> {
    fun deleteByDeckIdAndTagId(deckId: Long, tagId: Long)
}
