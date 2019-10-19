package coraythan.keyswap.cards

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.House
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.KeyforgeDeck
import coraythan.keyswap.synergy.SynTraitType
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.containsTrait
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Transactional
@Service
class CardService(
        private val cardRepo: CardRepo,
        private val keyforgeApi: KeyforgeApi,
        private val extraCardInfoRepo: ExtraCardInfoRepo,
        private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private var previousInfoWithNames: Map<String, Card>? = null
    private var nonMaverickCachedCards: Map<CardNumberSetPair, Card>? = null
    private var nonMaverickCachedCardsList: List<Card>? = null
    private var nonMaverickCachedCardsListNoDups: List<Card>? = null
    lateinit var previousExtraInfo: Map<CardNumberSetPair, ExtraCardInfo>
    lateinit var extraInfo: Map<CardNumberSetPair, ExtraCardInfo>
    lateinit var nextExtraInfo: Map<CardNumberSetPair, ExtraCardInfo>
    var activeAercVersion: Int = 0

    val publishAercVersion = 3

    fun loadExtraInfo() {

        // TODO delete me
        val allInfos = extraCardInfoRepo.findAll().mapNotNull {
            if (it.cardName != null) {
                null
            } else {
                it.copy(cardName = cardRepo.findByExpansionAndCardNumberAndMaverickFalse(
                        it.cardNumbers.first().expansion.expansionNumber,
                        it.cardNumbers.first().cardNumber
                ).cardTitle)
            }
        }
        if (allInfos.isNotEmpty()) {
            log.info("Adding names to ${allInfos.size} extra infos with no names")
            extraCardInfoRepo.saveAll(allInfos)
        }

        this.extraInfo = mapInfos(extraCardInfoRepo.findByActiveTrue())
        this.activeAercVersion = this.extraInfo.maxBy { it.value.version }?.value?.version ?: 0
        this.nextExtraInfo = mapInfos(extraCardInfoRepo.findByVersion(this.activeAercVersion + 1))
        val previousOnes = extraCardInfoRepo.findByVersionLessThanAndActiveFalse(this.activeAercVersion)
                .filter { it.version < this.activeAercVersion }
                .groupBy { it.cardName }
                .mapNotNull { it.value.maxBy { infos -> infos.version } }
        this.previousExtraInfo = mapInfos(previousOnes)

        log.info("Active aerc version $activeAercVersion published verison $publishAercVersion")
        if (activeAercVersion < publishAercVersion) {
            this.activeAercVersion = publishAercVersion
            val toPublish = this.nextExtraInfo
            val potentiallyUnpublish = this.extraInfo
            val toSave = toPublish.map { it.value.copy(active = true, published = ZonedDateTime.now()) }
            val unpublish = toPublish.mapNotNull { potentiallyUnpublish[it.key]?.copy(active = false) }
            extraCardInfoRepo.saveAll(toSave.plus(unpublish))
            log.info("Active aerc version $activeAercVersion published verison $publishAercVersion done publishing published " +
                    "${toSave.size} unpublished ${unpublish.size}")
            this.loadExtraInfo()
        }
    }

    private fun mapInfos(extraInfos: List<ExtraCardInfo>) = extraInfos
            .map {
                when {
                    it.traits.containsTrait(SynergyTrait.alpha) && !it.synergies.containsTrait(SynergyTrait.alpha) ->
                        it.copy(synergies = it.synergies.plus(SynTraitValue(SynergyTrait.alpha, -3, SynTraitType.house)))
                    it.traits.containsTrait(SynergyTrait.omega) && !it.synergies.containsTrait(SynergyTrait.omega) ->
                        it.copy(synergies = it.synergies.plus(SynTraitValue(SynergyTrait.omega, -3, SynTraitType.house)))
                    else -> it
                }
            }
            .flatMap { cardInfo ->
                cardInfo.cardNumbers.map {
                    it.toNumberSetPair() to cardInfo.copy(
                            synergies = cardInfo.synergies.sorted()
                    )
                }
            }
            .toMap()

    fun findByExpansionCardNumberHouse(expansion: Int, cardNumber: String, house: House) = cardRepo.findByExpansionAndCardNumberAndHouse(expansion, cardNumber, house)

    fun previousInfo(): Map<String, Card> {
        if (previousInfoWithNames == null) {
            reloadCachedCards()
        }
        return previousInfoWithNames!!
    }

    fun allFullCardsNonMaverick(): List<Card> {
        if (nonMaverickCachedCardsList == null) {
            reloadCachedCards()
        }
        return nonMaverickCachedCardsList!!
    }

    fun allFullCardsNonMaverickNoDups(): List<Card> {
        if (nonMaverickCachedCardsListNoDups == null) {
            reloadCachedCards()
        }
        return nonMaverickCachedCardsListNoDups!!
    }

    fun allFullCardsNonMaverickMap(): Map<CardNumberSetPair, Card> {
        if (nonMaverickCachedCards == null) {
            reloadCachedCards()
        }
        return nonMaverickCachedCards!!
    }

    fun realAllCards(): List<Card> {
        return cardRepo.findAll()
    }

    fun deckSearchResultCardsFromCardIds(cardIdsString: String): List<DeckSearchResultCard> {
        return cardsFromCardIds(cardIdsString)
                .sorted()
                .map { it.toDeckSearchResultCard() }
    }

    fun cardsForDeck(deck: Deck): List<Card> {
        val cards = cardsFromCardIds(deck.cardIds, deck.keyforgeId)
        check(cards.size == 36) { "Why doesn't this deck have cards? $deck" }
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
        val cards = fullCardsFromCards(cardRepo.findByMaverickFalse()).map {
            val synTraitsFromTraits = it.traits
                    .mapNotNull { trait ->
                        SynergyTrait.fromTrait(trait)
                    }
                    .map { trait -> SynTraitValue(trait = trait) }
            CardNumberSetPair(it.expansionEnum, it.cardNumber) to
                    if (synTraitsFromTraits.isEmpty()) it else it.copy(extraCardInfo = it.extraCardInfo!!.copy(traits = it.extraCardInfo!!.traits.plus(synTraitsFromTraits)))
        }.toMap()
        nonMaverickCachedCards = cards.map { it.key to it.value.copy(extraCardInfo = extraInfo[it.key], nextExtraCardInfo = nextExtraInfo[it.key]) }.toMap()
        nonMaverickCachedCardsList = nonMaverickCachedCards?.values?.toList()?.sorted()
        nonMaverickCachedCardsListNoDups = nonMaverickCachedCardsList
                ?.map { it.cardTitle to it }
                ?.toMap()?.values
                ?.toList()
                ?.sortedBy { "${it.house}${it.cardNumber.padStart(4, '0')}" }
        previousInfoWithNames = previousExtraInfo.map { entry ->
            val card = nonMaverickCachedCards!![entry.key] ?: error("")
            card.cardTitle to card.copy(extraCardInfo = entry.value)
        }.toMap()
    }

    private fun fullCardsFromCards(cards: List<Card>) = cards.map {
        val cardNumber = CardNumberSetPair(it.expansionEnum, it.cardNumber)
        it.copy(
                extraCardInfo = this.extraInfo[cardNumber]
                        ?: throw IllegalStateException("No extra info for ${it.expansion} ${it.cardNumber}"),
                nextExtraCardInfo = this.nextExtraInfo[cardNumber]
        )
    }

    private fun cardsFromCardIds(cardIdsString: String, deckId: String? = null): List<Card> {
        require(!cardIdsString.isBlank()) { "Card id string was blank! deck id: $deckId" }
        val cardIds = objectMapper.readValue<CardIds>(cardIdsString)
        val realCards = allFullCardsNonMaverickMap()
        return cardIds.cardIds.flatMap { entry ->
            entry.value.map {
                val realCard = realCards[it.toNew()]
                realCard?.copy(house = entry.key, maverick = entry.key != realCard.house) ?: throw java.lang.IllegalStateException("No card for $it")
            }
        }
    }
}
