package coraythan.keyswap.cards.cardnotes

import coraythan.keyswap.Api
import coraythan.keyswap.generatets.GenerateTs
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/card-notes")
class CardNotesEndpoints(
    private val service: CardNotesService,
) {

    @GetMapping("/{cardId}")
    fun findNotes(@PathVariable cardId: Long) = service.findNotesForCard(cardId)

    @PostMapping("/secured")
    fun saveNote(@RequestBody noteDto: CardNotesDto) = service.saveNote(noteDto)

    @PostMapping("/secured/approved")
    fun updateApproval(@RequestBody approval: NoteApproval) = service.updateApproval(approval)

    @PostMapping("/secured/note")
    fun updateNote(@RequestBody note: NoteText) = service.updateNote(note)

}

@GenerateTs
data class NoteApproval(
    val approved: Boolean,
    val noteId: UUID
)

@GenerateTs
data class NoteText(
    val note: String,
    val noteId: UUID
)
