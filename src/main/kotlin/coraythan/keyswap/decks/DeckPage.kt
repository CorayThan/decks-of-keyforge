package coraythan.keyswap.decks

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Id

enum class DeckPageType {
    IMPORT,
    STATS,
    RATINGS,
    WINS,
    LOSSES
}

@Entity
data class DeckPage(

        val currentPage: Int = 1,

        @Enumerated(EnumType.STRING)
        val type: DeckPageType = DeckPageType.IMPORT,

        @Id
        val id: UUID = UUID.randomUUID()
)

@Transactional
@Service
class DeckPageService(
        val deckPageRepo: DeckPageRepo
) {
    fun findCurrentPage(type: DeckPageType = DeckPageType.IMPORT): Int {
        val all = deckPageRepo.findAllByType(type).toList()
        return when {
            all.isEmpty() -> {
                val page = deckPageRepo.save(DeckPage(type = type))
                page.currentPage
            }
            all.size > 1 -> throw IllegalStateException("More than one deck page?! $all")
            else -> all[0].currentPage
        }
    }

    fun setCurrentPage(currentPage: Int, type: DeckPageType = DeckPageType.IMPORT) {
        deckPageRepo.deleteAllByType(type)
        deckPageRepo.save(DeckPage(currentPage, type))
    }
}

interface DeckPageRepo : CrudRepository<DeckPage, UUID> {
    fun findAllByType(type: DeckPageType): List<DeckPage>
    fun deleteAllByType(type: DeckPageType)
}
