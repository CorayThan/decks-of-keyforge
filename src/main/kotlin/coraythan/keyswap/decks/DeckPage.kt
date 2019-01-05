package coraythan.keyswap.decks

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class DeckPage(

        val currentPage: Int = 1,

        @Id
        val id: UUID = UUID.randomUUID()
)

@Transactional
@Service
class DeckPageService(
        val deckPageRepo: DeckPageRepo
) {
    fun findCurrentPage(): Int {
        val all = deckPageRepo.findAll().toList()
        return when {
            all.isEmpty() -> {
                val page = deckPageRepo.save(DeckPage())
                page.currentPage
            }
            all.size > 1 -> throw IllegalStateException("More than one deck page?! $all")
            else -> all[0].currentPage
        }
    }

    fun setCurrentPage(currentPage: Int) {
        val all = deckPageRepo.findAll().toList()
        when {
            all.size == 1 -> deckPageRepo.save(all[0].copy(currentPage = currentPage))
            else -> throw IllegalStateException("More than one deck page?! $all")
        }
    }
}

interface DeckPageRepo : CrudRepository<DeckPage, UUID>

