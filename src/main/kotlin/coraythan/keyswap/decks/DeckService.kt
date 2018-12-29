package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

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

        if (filters.forSale) predicate.and(deckQ.forSale.isTrue)
        if (filters.forTrade) predicate.and(deckQ.forTrade.isTrue)
        if (filters.containsMaverick) predicate.and(deckQ.cards.any().maverick.isTrue)
        if (filters.title.isNotBlank()) predicate.and(deckQ.name.likeIgnoreCase("%${filters.title}%"))

        val sortProperty = when (filters.sort) {
            DeckSortOptions.ADDED_DATE -> "id"
            DeckSortOptions.DECK_NAME -> "name"
            DeckSortOptions.AMBER -> "expectedAmber"
            DeckSortOptions.POWER -> "totalPower"
            DeckSortOptions.CREATURES -> "totalCreatures"
            DeckSortOptions.MAVERICK_COUNT -> "maverickCount"
            DeckSortOptions.SPECIALS -> "specialsCount"
            DeckSortOptions.RARES -> "raresCount"
            DeckSortOptions.UNCOMMONS -> "uncommonsCount"
        }

        val deckPage = deckRepo.findAll(predicate, PageRequest.of(
                filters.page, 20,
                Sort.by(filters.sortDirection.direction, sortProperty)
        ))

        log.info("Found ${deckPage.content.size} decks. Current page ${filters.page}. Total pages ${deckPage.totalPages}. Sorted by $sortProperty.")

        return DecksPage(deckPage.content, filters.page, deckPage.totalPages)
    }

    fun findDeck(keyforgeId: String) = deckRepo.findByKeyforgeId(keyforgeId)

    fun saleInfoForDeck(keyforgeId: String): List<DeckSaleInfo> {
        val deck = findDeck(keyforgeId) ?: return listOf()
        return deck.userDecks.mapNotNull {
            if (!it.forSale && !it.forTrade) {
                null
            } else {
                DeckSaleInfo(
                        forSale = it.forSale,
                        forTrade = it.forTrade,
                        askingPrice = it.askingPrice,
                        listingInfo = it.listingInfo,
                        externalLink = it.externalLink,
                        condition = it.condition!!,
                        dateListed = it.dateListed,
                        username = it.user.username,
                        publicContactInfo = it.user.publicContactInfo
                )
            }
        }.sortedByDescending { it.dateListed }
    }
}
