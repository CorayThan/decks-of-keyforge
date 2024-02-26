package coraythan.keyswap.cards.cardnotes

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CardNotesRepo : JpaRepository<CardNotes, UUID> {
    fun findAllByCardIdOrderByCreatedDesc(cardId: Long): List<CardNotes>
}
