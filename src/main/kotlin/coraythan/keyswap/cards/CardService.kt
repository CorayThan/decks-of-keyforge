package coraythan.keyswap.cards

import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.decks.Deck
import coraythan.keyswap.decks.KeyforgeApi
import org.slf4j.LoggerFactory
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

        if (!filters.includeMavericks) predicate.and(cardQ.is_maverick.isFalse)
        if (filters.rarities != null) predicate.and(cardQ.rarity.`in`(filters.rarities))
        if (filters.types != null) predicate.and(cardQ.card_type.`in`(filters.types))
        if (filters.houses != null) predicate.and(cardQ.house.`in`(filters.houses))
        if (filters.title != null) predicate.and(cardQ.card_title.likeIgnoreCase("%${filters.title}%"))

        if (filters.amberMax != null) predicate.and(cardQ.amber.lt(filters.amberMax + 1))
        if (filters.amberMin != null) predicate.and(cardQ.amber.gt(filters.amberMin - 1))
        if (filters.powerMax != null) predicate.and(cardQ.power.lt(filters.powerMax + 1))
        if (filters.powerMin != null) predicate.and(cardQ.power.gt(filters.powerMin - 1))
        if (filters.armorMax != null) predicate.and(cardQ.armor.lt(filters.armorMax + 1))
        if (filters.armorMin != null) predicate.and(cardQ.armor.gt(filters.armorMin - 1))

        return cardRepo.findAll(predicate)
    }

    fun importNewCards(decks: List<Deck>) {
        this.loadCachedCards()
        decks.forEach { deck ->
            if (deck.cards?.any { !cachedCards.keys.contains(it) } == true) {
                keyforgeApi.findDeck(deck.id)?._linked?.cards?.forEach {
                    if (!cachedCards.keys.contains(it.id)) cardRepo.save(it.toSaveable())
                }
                this.loadCachedCards()
                log.info("Loaded cards from deck.")
            } else {
                log.info("Skipped loading cards from deck.")
            }
        }
    }
}