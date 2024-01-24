package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckSasValuesUpdatable
import coraythan.keyswap.decks.models.QDeckSasValuesUpdatable
import jakarta.persistence.*
import org.slf4j.LoggerFactory
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import kotlin.system.measureTimeMillis

enum class DeckPageType(val quantity: Int) {
    IMPORT(10),
    STATS(10000),
    RATING(10000),
    WINS(25),
    LOSSES(25),
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
    val deckSasValuesUpdatableRepo: DeckSasValuesUpdatableRepo,
    entityManager: EntityManager
) {
    private val query = JPAQueryFactory(entityManager)
    private val log = LoggerFactory.getLogger(this::class.java)

    fun findCurrentPage(type: DeckPageType): Int {
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

    fun setCurrentPage(currentPage: Int, type: DeckPageType) {
        deckPageRepo.deleteAllByType(type)
        deckPageRepo.save(DeckPage(currentPage, type))
    }

    fun deckSasUpdatableValuesForPage(
        currentPage: Int,
        type: DeckPageType,
        latestFirst: Boolean = false
    ): DeckSasUpdatableValuesResult {
        val idStart = currentPage.toLong() * type.quantity
        val idEnd = idEndForPage(currentPage, type)
        val results: List<DeckSasValuesUpdatable>

        val searchMs = measureTimeMillis {
            val deckQ = QDeckSasValuesUpdatable.deckSasValuesUpdatable
            val predicate = BooleanBuilder()
                .and(deckQ.id.between(idStart, idEnd))
            results = query.selectFrom(deckQ)
                .innerJoin(deckQ.deck).fetchJoin()
                .where(predicate)
                .let {
                    if (latestFirst) {
                        it.orderBy(deckQ.importDateTime.desc())
                    } else {
                        it
                    }
                }
                .fetch()

        }

        // log.info("Deck $type id start $idStart end $idEnd took ${searchMs}ms to find ${results.size} decks. latestFirst: $latestFirst")

        val hasMore = if (results.isEmpty()) deckSasValuesUpdatableRepo.existsByIdGreaterThan(idEnd) else true
        return DeckSasUpdatableValuesResult(results, hasMore)
    }

    fun decksForPage(currentPage: Int, type: DeckPageType, latestFirst: Boolean = false): DeckPageResult {
        val dsv1s = deckSasUpdatableValuesForPage(currentPage, type, latestFirst)

        return DeckPageResult(
            decks = dsv1s.decks.map { it.deck },
            moreResults = dsv1s.moreResults,
        )
    }

    fun idEndForPage(currentPage: Int, type: DeckPageType): Long {
        return ((currentPage.toLong() + 1) * type.quantity) - 1
    }
}

interface DeckPageRepo : CrudRepository<DeckPage, UUID> {
    fun findAllByType(type: DeckPageType): List<DeckPage>
    fun deleteAllByType(type: DeckPageType)
}

data class DeckPageResult(
    val decks: List<Deck>,
    val moreResults: Boolean,
)

data class DeckSasUpdatableValuesResult(
    val decks: List<DeckSasValuesUpdatable>,
    val moreResults: Boolean,
)
