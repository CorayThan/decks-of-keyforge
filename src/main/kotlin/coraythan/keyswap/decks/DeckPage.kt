package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.QDeck
import org.slf4j.LoggerFactory
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.*

enum class DeckPageType(val quantity: Int) {
    IMPORT(10),
    STATS(10000),
    RATING(500),
    WINS(25),
    LOSSES(25)
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
        val deckPageRepo: DeckPageRepo,
        entityManager: EntityManager
) {
    private val query = JPAQueryFactory(entityManager)
    private val log = LoggerFactory.getLogger(this::class.java)

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

    fun decksForPage(currentPage: Int, type: DeckPageType): List<Deck> {
        val idStart = currentPage * type.quantity
        val idEnd = idEndForPage(currentPage, type)
        log.info("Deck $type id start $idStart end $idEnd")
        val deckQ = QDeck.deck
        val predicate = BooleanBuilder()
                .and(deckQ.id.between(idStart, idEnd))
        return query.selectFrom(deckQ)
                .where(predicate)
                .fetch()
    }

    fun idEndForPage(currentPage: Int, type: DeckPageType): Int {
        return ((currentPage + 1) * type.quantity) - 1
    }
}

interface DeckPageRepo : CrudRepository<DeckPage, UUID> {
    fun findAllByType(type: DeckPageType): List<DeckPage>
    fun deleteAllByType(type: DeckPageType)
}
