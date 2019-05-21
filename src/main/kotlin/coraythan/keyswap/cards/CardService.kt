package coraythan.keyswap.cards

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.House
import coraythan.keyswap.decks.currentDeckRatingVersion
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.KeyforgeDeck
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
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
    lateinit var extraInfo: Map<CardNumberSetPair, ExtraCardInfo>

    fun loadExtraInfo() {
        val extraInfosFromFile: List<ExtraCardInfo> = yamlMapper.readValue(
                ClassPathResource("extra-deck-info-v$currentDeckRatingVersion.yml").inputStream
        )
        this.extraInfo = extraInfosFromFile
                .flatMap { cardInfo ->
                    cardInfo.setNumbers.map {
                        CardNumberSetPair(expansion = it, cardNumber = cardInfo.cardNumber) to cardInfo.copy(
                                synergies = cardInfo.synergies.sorted()
                        )
                    }
                }
                .toMap()
    }

    fun findByExpansionCardNumberHouse(expansion: Int, cardNumber: String, house: House) = cardRepo.findByExpansionAndCardNumberAndHouse(expansion, cardNumber, house)

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

    fun deckSearchResultCardsFromCardIds(cardIdsString: String): List<DeckSearchResultCard> {
        return cardsFromCardIds(cardIdsString).sorted().map { it.toDeckSearchResultCard() }
    }

    fun cardsForDeck(deck: Deck): List<Card> {
        val cards = cardsFromCardIds(deck.cardIds)
        if (cards.size != 36) throw IllegalStateException("Why doesn't this deck have cards? $deck")
        return cards
    }

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
            if (deck.cards == null || deck.cards.isEmpty()) {
                log.warn("Deck from keyforge api didn't have cards!? ${deck.id}")
            }
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

    fun reloadCachedCards() {
        nonMaverickCachedCards = fullCardsFromCards(cardRepo.findByMaverickFalse()).map {
            it.traits.size
            CardNumberSetPair(it.expansion, it.cardNumber) to it
        }.toMap()
        nonMaverickCachedCardsList = nonMaverickCachedCards?.values?.toList()?.sorted()

        val addToExtraInfo = nonMaverickCachedCards?.mapNotNull { entry ->
            val card = entry.value
            val synTraitsFromTraits = card.traits.mapNotNull { trait ->
                trait.synTrait
            }
            if (synTraitsFromTraits.isNotEmpty()) {
                entry.key to synTraitsFromTraits
            } else {
                null
            }
        }?.toMap()

        extraInfo = extraInfo.map {
            val add = addToExtraInfo?.get(it.key)
            it.key to if (add == null) it.value else it.value.copy(traits = it.value.traits.plus(add))
        }.toMap()

    }


    private fun fullCardsFromCards(cards: List<Card>) = cards.map {
        it.copy(extraCardInfo = this.extraInfo[CardNumberSetPair(it.expansion, it.cardNumber)]
                ?: throw IllegalStateException("No extra info for ${it.expansion} ${it.cardNumber}"))
    }

    private fun cardsFromCardIds(cardIdsString: String): List<Card> {
        if (cardIdsString.isBlank()) {
            throw IllegalArgumentException("Card id string was blank!")
        }
        val cardIds = objectMapper.readValue<CardIds>(cardIdsString)
        val realCards = allFullCardsNonMaverickMap()
        return cardIds.cardIds.flatMap { entry ->
            entry.value.map {
                val realCard = realCards[it]
                realCard?.copy(house = entry.key, maverick = entry.key != realCard.house) ?: throw java.lang.IllegalStateException("No card for $it")
            }
        }
    }
}
