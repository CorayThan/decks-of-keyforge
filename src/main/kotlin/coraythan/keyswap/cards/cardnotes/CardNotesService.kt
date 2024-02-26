package coraythan.keyswap.cards.cardnotes

import coraythan.keyswap.cards.dokcards.DokCardRepo
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.users.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class CardNotesService(
    private val repo: CardNotesRepo,
    private val dokCardRepo: DokCardRepo,
    private val currentUserService: CurrentUserService,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun findNotesForCard(cardId: Long): List<CardNotesDto> {
        currentUserService.contentCreatorOrUnauthorized()
        return repo.findAllByCardIdOrderByCreatedDesc(cardId)
            .map { it.toDto() }
    }

    fun updateApproval(noteApproval: NoteApproval) {
        val user = currentUserService.loggedInContentCreatorOrUnauthorized()
        val notes = repo.findByIdOrNull(noteApproval.noteId) ?: throw IllegalStateException("No note for $noteApproval")
        if (notes.user.id != user.id) throw UnauthorizedException("Must be note creator to update approval.")
        repo.save(notes.copy(approved = noteApproval.approved))
    }

    fun updateNote(noteText: NoteText) {
        val user = currentUserService.loggedInContentCreatorOrUnauthorized()
        val notes = repo.findByIdOrNull(noteText.noteId) ?: throw IllegalStateException("No note for $noteText")
        if (notes.user.id != user.id) throw UnauthorizedException("Must be note creator to update approval.")
        repo.save(notes.copy(note = noteText.note.trim()))
    }

    fun saveNote(notesDto: CardNotesDto) {
        val user = currentUserService.loggedInContentCreatorOrUnauthorized()
        repo.save(
            CardNotes(
                note = notesDto.note.trim(),
                approved = notesDto.approved,
                extraInfoVersion = notesDto.extraInfoVersion,
                card = dokCardRepo.findByIdOrNull(notesDto.cardId)
                    ?: throw BadRequestException("No card for id ${notesDto.cardId}"),
                user = user,
            )
        )
    }
}
