package coraythan.keyswap.cards

import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.KeyforgeApi
import coraythan.keyswap.decks.KeyforgeDeck
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class CardService(
        val cardRepo: CardRepo,
        val keyforgeApi: KeyforgeApi
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    var cachedCards: Map<String, Card> = mapOf()

    @PostConstruct
    fun loadCachedCards() {
        log.debug("Loading cached cards.")
        this.cachedCards = cardRepo.findAll().associate { it.id to it }
    }

    fun filterCards(filters: CardFilters): Iterable<Card> {
        val cardQ = QCard.card
        val predicate = BooleanBuilder()

        if (!filters.includeMavericks) predicate.and(cardQ.isMaverick.isFalse)
        if (filters.rarities.isNotEmpty()) predicate.and(cardQ.rarity.`in`(filters.rarities))
        if (filters.types.isNotEmpty()) predicate.and(cardQ.cardType.`in`(filters.types))
        if (filters.houses.isNotEmpty()) predicate.and(cardQ.house.`in`(filters.houses))
        if (filters.ambers.isNotEmpty()) predicate.and(cardQ.amber.`in`(filters.ambers))
        if (filters.powers.isNotEmpty()) predicate.and(cardQ.power.`in`(filters.powers))
        if (filters.armors.isNotEmpty()) predicate.and(cardQ.armor.`in`(filters.armors))

        if (filters.title.isNotBlank()) predicate.and(cardQ.cardTitle.likeIgnoreCase("%${filters.title}%"))
        if (filters.description.isNotBlank()) predicate.and(cardQ.cardText.likeIgnoreCase("%${filters.description}%"))

        val sortProperty = when (filters.sort) {
            CardSortOptions.SET_NUMBER -> "cardNumber"
            CardSortOptions.CARD_NAME -> "cardTitle"
            CardSortOptions.AMBER -> "amber"
            CardSortOptions.POWER -> {
                predicate.and(cardQ.cardType.`in`(CardType.Creature))
                "power"
            }
            CardSortOptions.ARMOR -> {
                predicate.and(cardQ.cardType.`in`(CardType.Creature))
                "armor"
            }
        }

        return cardRepo.findAll(predicate, Sort.by(filters.sortDirection.direction, sortProperty))
    }

    fun importNewCards(decks: List<KeyforgeDeck>) {
        this.loadCachedCards()
        decks.forEach { deck ->
            if (deck.cards?.any { !cachedCards.keys.contains(it) } == true) {
                keyforgeApi.findDeck(deck.id)?._linked?.cards?.forEach {
                    if (!cachedCards.keys.contains(it.id)) cardRepo.save(it.toCard())
                }
                this.loadCachedCards()
                log.info("Loaded cards from deck.")
            } else {
                log.info("Skipped loading cards from deck.")
            }
        }
    }
}