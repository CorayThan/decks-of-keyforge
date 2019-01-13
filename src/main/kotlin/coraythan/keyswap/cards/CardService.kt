package coraythan.keyswap.cards

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.KeyforgeApi
import coraythan.keyswap.deckcard.CardIds
import coraythan.keyswap.deckcard.CardNumberSetPair
import coraythan.keyswap.decks.Deck
import coraythan.keyswap.decks.KeyforgeDeck
import org.slf4j.LoggerFactory
import org.springframework.core.io.ClassPathResource
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class CardService(
        private val cardRepo: CardRepo,
        private val keyforgeApi: KeyforgeApi,
        private val yamlMapper: YAMLMapper,
        private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private var nonMaverickCachedCards: Map<CardNumberSetPair, Card>? = null
    private var nonMaverickCachedCardsList: List<Card>? = null
    lateinit var extraInfo: Map<Int, ExtraCardInfo>

    fun loadExtraInfo() {
        val extraInfosFromFile: List<ExtraCardInfo> = yamlMapper.readValue(
                ClassPathResource("extra-deck-info.yml").inputStream
        )
        this.extraInfo = extraInfosFromFile
                .map { it.cardNumber to it.copy(synergies = it.synergies.sorted()) }
                .toMap()
    }

    fun allFullCardsNonMaverick(): List<Card> {
        if (nonMaverickCachedCardsList == null) {
            reloadCachedCards()
        }
        return nonMaverickCachedCardsList!!
    }

    fun allFullCardsNonMaverickMap(): Map<CardNumberSetPair, Card> {
        if (nonMaverickCachedCards == null) {
            reloadCachedCards()
        }
        return nonMaverickCachedCards!!
    }

    fun deckSearchResultCardsFromCardIds(cardIdsString: String): List<DeckSearchResultCard>? {
        return cardsFromCardIds(cardIdsString)?.map { it.toDeckSearchResultCard() }
    }

    fun cardsForDeck(deck: Deck) = cardsFromCardIds(deck.cardIds) ?: fullCardsFromCards(deck.cardsList)

    fun filterCards(filters: CardFilters): Iterable<Card> {
        val cardQ = QCard.card
        val predicate = BooleanBuilder()

        if (!filters.includeMavericks) predicate.and(cardQ.maverick.isFalse)
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

        val cards = cardRepo.findAll(predicate, Sort.by(filters.sortDirection.direction, sortProperty)).toList()
        return fullCardsFromCards(cards)
    }

    fun importNewCards(decks: List<KeyforgeDeck>): List<Card> {
        val cards = cardRepo.findAll()
        val cardsToReturn = cards.toMutableList()
        val cardKeys = cards.map { it.id }.toSet()
        decks.forEach { deck ->
            if (deck.cards?.any { !cardKeys.contains(it) } == true) {
                keyforgeApi.findDeck(deck.id)?._linked?.cards?.forEach {
                    if (!cardKeys.contains(it.id)) {
                        cardsToReturn.add(this.saveNewCard(it.toCard(this.extraInfo)))
                    }
                }
                reloadCachedCards()
                log.debug("Loaded cards from deck.")
            }
        }
        return cardsToReturn
    }

    fun saveNewCard(card: Card): Card {
        return cardRepo.save(card)
    }

    private fun fullCardsFromCards(cards: List<Card>) = cards.map { it.copy(extraCardInfo = this.extraInfo[it.cardNumber]) }

    private fun cardsFromCardIds(cardIdsString: String): List<Card>? {
        val cardIds = objectMapper.readValue<CardIds>(cardIdsString)
        val realCards = allFullCardsNonMaverickMap()
        return cardIds.cardIds.flatMap { entry ->
            entry.value.map {
                realCards[it]?.copy(house = entry.key) ?: return null
            }
        }
    }

    private fun reloadCachedCards() {
        nonMaverickCachedCards = fullCardsFromCards(cardRepo.findByMaverickFalse()).map {
            it.traits.size
            CardNumberSetPair(it.expansion, it.cardNumber) to it
        }.toMap()
        nonMaverickCachedCardsList = nonMaverickCachedCards?.values?.toList()?.sorted()
    }

}
