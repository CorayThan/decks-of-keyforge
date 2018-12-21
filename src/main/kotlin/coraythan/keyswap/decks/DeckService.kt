package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Transactional
@Service
class DeckService(
    val deckRepo: DeckRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun filterDecks(filters: DeckFilters): DecksPage {
        val deckQ = QDeck.deck
        val predicate = BooleanBuilder()

        if (filters.houses.isNotEmpty()) {
            if (filters.houses.size < 4) {
                filters.houses.forEach { predicate.and(deckQ.houses.contains(it)) }
            } else {
                filters.houses.forEach { predicate.and(deckQ.houses.any().eq(it)) }
            }
        }

        if (filters.containsMaverick) predicate.and(deckQ.cards.any().maverick.isTrue)
        if (filters.title.isNotBlank()) predicate.and(deckQ.name.likeIgnoreCase("%${filters.title}%"))

        val deckPage = deckRepo.findAll(predicate, PageRequest.of(filters.page, 20))
        return DecksPage(deckPage.content, filters.page, deckPage.totalPages)
    }

    fun findDeck(id: String) = deckRepo.getOne(id)
}