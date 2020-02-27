package coraythan.keyswap.cards

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.House
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.KeyforgeDeck
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.spoilers.SpoilerRepo
import coraythan.keyswap.synergy.*
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

// Manually update this when publishing a new version of AERC. Also rerates all decks
val publishedAercVersion = 10

@Transactional
@Service
class CardService(
        private val cardRepo: CardRepo,
        private val keyforgeApi: KeyforgeApi,
        private val extraCardInfoRepo: ExtraCardInfoRepo,
        private val spoilerRepo: SpoilerRepo,
        private val cardIdentifierRepo: CardIdentifierRepo,
        private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private var previousInfoWithNames: Map<String, Card>? = null
    private var nextInfoWithNames: Map<String, Card>? = null
    private var nonMaverickCachedCards: Map<CardNumberSetPair, Card>? = null
    private var nonMaverickCachedCardsList: List<Card>? = null
    private var nonMaverickCachedCardsListNoDups: List<Card>? = null
    lateinit var previousExtraInfo: Map<CardNumberSetPair, ExtraCardInfo>
    lateinit var extraInfo: Map<CardNumberSetPair, ExtraCardInfo>
    lateinit var nextExtraInfo: Map<CardNumberSetPair, ExtraCardInfo>
    var activeAercVersion: Int = 0

    fun publishNextInfo() {
        log.info("Publishing next extra info started")

        try {
            val currentInfo = mapInfosOnly(extraCardInfoRepo.findByActiveTrue())
            this.activeAercVersion = currentInfo.maxBy { it.value.version }?.value?.version ?: 0

            log.info("Active aerc version $activeAercVersion published version $publishedAercVersion")
            if (activeAercVersion < publishedAercVersion) {

//                val allInfosToPotentiallyUpdateNamesFor = extraCardInfoRepo.findAll()
//                        .mapNotNull {
//                            val num = it.cardNumbers.first()
//                            val card = cardRepo.findByExpansionAndCardNumberAndMaverickFalse(num.expansion.expansionNumber, num.cardNumber).first()
//                            if (card.cardTitle == it.cardName) {
//                                null
//                            } else {
//                                log.info("Card name to update: ${it.cardName} -> ${card.cardTitle}")
//                                it.cardName = card.cardTitle
//                                it
//                            }
//                        }
//
//                if (allInfosToPotentiallyUpdateNamesFor.isNotEmpty()) {
//                    extraCardInfoRepo.saveAll(allInfosToPotentiallyUpdateNamesFor)
//                }

                val toPublish = mapInfosOnly(extraCardInfoRepo.findByVersion(publishedAercVersion))
                toPublish.forEach {
                    it.value.active = true
                    it.value.published = ZonedDateTime.now()
                }
                val unpublish = toPublish.mapNotNull {
                    val oldInfo = currentInfo[it.key]
                    oldInfo?.active = false
                    oldInfo
                }
                extraCardInfoRepo.saveAll(toPublish.map { it.value }.plus(unpublish))
                log.info("Publishing next extra info fully complete. Active aerc version $activeAercVersion published verison $publishedAercVersion " +
                        "done publishing published " +
                        "${toPublish.size} unpublished ${unpublish.size}")
            }
        } catch (exception: Exception) {
            log.error("Nothing is going to work because we couldn't publish extra info!", exception)
            throw IllegalStateException(exception)
        }
    }

    fun loadExtraInfo() {
        log.info("Loading extra info started")
        try {
            this.extraInfo = mapInfos(extraCardInfoRepo.findByActiveTrue())
            this.activeAercVersion = this.extraInfo.maxBy { it.value.version }?.value?.version ?: 0
            this.nextExtraInfo = mapInfos(extraCardInfoRepo.findByVersion(this.activeAercVersion + 1))
            val previousOnes = extraCardInfoRepo.findByVersionLessThanAndActiveFalse(this.activeAercVersion)
                    .filter { it.version < this.activeAercVersion }
                    .groupBy { it.cardName }
                    .mapNotNull { it.value.maxBy { infos -> infos.version } }
            this.previousExtraInfo = mapInfos(previousOnes)

        } catch (exception: Exception) {
            log.error("Nothing is going to work because we couldn't load extra info!", exception)
            throw IllegalStateException(exception)
        }
        log.info("Loading extra info fully complete for AERC version ${this.activeAercVersion}")
    }

    fun convertSpoilers() {
        val spoilers = spoilerRepo.findAll()
                .filter { it.cardNumber != null }

        spoilers.forEach { spoiler ->
            log.info("Converting spoiler ${spoiler.cardTitle} to extra info")
            if (spoiler.reprint) {
                val existingInfos = extraCardInfoRepo.findByCardName(spoiler.cardTitle)
                check(existingInfos.isNotEmpty()) { "No info for ${spoiler.cardTitle}" }
                existingInfos.forEach {
                    val cardId = CardIdentifier(
                            cardNumber = spoiler.cardNumber!!,
                            expansion = Expansion.WORLDS_COLLIDE,
                            info = it
                    )
                    it.cardNumbers.add(cardId)
                    extraCardInfoRepo.save(it)
                }
            } else {
                val info = ExtraCardInfo(
                        cardName = spoiler.cardTitle,
                        expectedAmber = spoiler.expectedAmber,
                        amberControl = spoiler.amberControl,
                        creatureControl = spoiler.creatureControl,
                        artifactControl = spoiler.artifactControl,
                        efficiency = spoiler.efficiency,
                        effectivePower = spoiler.effectivePower,
                        disruption = spoiler.disruption,
                        amberProtection = spoiler.amberProtection,
                        houseCheating = spoiler.houseCheating,
                        other = spoiler.other,
                        active = true
                )
                val saved = extraCardInfoRepo.save(info)
                log.info("Saved info for ${spoiler.cardTitle}")
                cardIdentifierRepo.save(CardIdentifier(
                        cardNumber = spoiler.cardNumber!!,
                        expansion = Expansion.WORLDS_COLLIDE,
                        info = saved
                ))
            }
        }

        log.info("converted spoilers to extra info")
    }

    private fun mapInfos(extraInfos: List<ExtraCardInfo>) = mapInfosOnly(extraInfos
            .map {
                when {
                    it.traits.containsTrait(SynergyTrait.alpha) && !it.synergies.containsTrait(SynergyTrait.alpha) ->
                        it.copy(synergies = it.synergies.plus(SynTraitValue(SynergyTrait.alpha, -3, SynTraitType.house)))
                    it.traits.containsTrait(SynergyTrait.omega) && !it.synergies.containsTrait(SynergyTrait.omega) ->
                        it.copy(synergies = it.synergies.plus(SynTraitValue(SynergyTrait.omega, -3, SynTraitType.house)))
                    else -> it
                }.copy(
                        synergies = it.synergies.sorted()
                )
            })

    private fun mapInfosOnly(extraInfos: List<ExtraCardInfo>) = extraInfos
            .flatMap { cardInfo ->
                cardInfo.cardNumbers.map {
                    it.toNumberSetPair() to cardInfo
                }
            }
            .toMap()

    fun findByExpansionCardNameHouse(expansion: Int, cardName: String, house: House) = cardRepo.findByExpansionAndCardTitleAndHouse(expansion, cardName, house)

    fun previousInfo(): Map<String, Card> {
        if (previousInfoWithNames == null) {
            reloadCachedCards()
        }
        return previousInfoWithNames!!
    }

    fun nextInfo(): Map<String, Card> {
        if (nextInfoWithNames == null) {
            reloadCachedCards()
        }
        return nextInfoWithNames!!
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
//        if (card.extraCardInfo == null) {
//            val preexistingInfo = extraInfo.values.filter { it.cardName == card.cardTitle }
//
//            if (preexistingInfo.isEmpty()) {
//                val cardId = CardIdentifier(expansion = card.expansionEnum, cardNumber = card.cardNumber)
//                val info = ExtraCardInfo(
//                        cardName = card.cardTitle,
//                        active = true,
//                        version = activeAercVersion
//                )
//
//                val savedInfo = extraCardInfoRepo.save(info)
//                cardId.info = savedInfo
//                cardIdentifierRepo.save(cardId)
//
//                // log.info("Saved ${card.cardTitle} ${card.cardNumber}")
//
//            } else {
//                preexistingInfo.forEach {
//                    val savedCardId = cardIdentifierRepo.save(CardIdentifier(
//                            expansion = card.expansionEnum,
//                            cardNumber = card.cardNumber,
//                            info = extraCardInfoRepo.findByIdOrNull(it.id)!!
//                    ))
//                    it.cardNumbers.add(savedCardId)
//                    extraCardInfoRepo.save(it)
//                }
//                // log.info("Added new sets for ${card.cardTitle} ${card.cardNumber}")
//            }
//        }
        return cardRepo.save(card)
    }

    fun reloadCachedCards() {
        val cards = fullCardsFromCards(cardRepo.findByMaverickFalse()).map {
            val extraTraits = it.traits
                    .mapNotNull { trait ->
                        SynergyTrait.fromTrait(trait)
                    }
                    .map { trait -> SynTraitValue(trait = trait) }
                    .let { traitsToAdd ->
                        if (it.cardType == CardType.Creature && it.aercScoreAverage >= 2.5) {
                            traitsToAdd.plus(SynTraitValue(
                                    trait = SynergyTrait.goodCreature,
                                    type = SynTraitType.anyHouse,
                                    rating = when {
                                        it.aercScoreAverage >= 3.5 -> TraitStrength.STRONG.value
                                        it.aercScoreAverage >= 3 -> TraitStrength.NORMAL.value
                                        else -> TraitStrength.WEAK.value
                                    }
                            ))
                        } else {
                            traitsToAdd
                        }
                    }
            CardNumberSetPair(it.expansionEnum, it.cardNumber) to
                    if (extraTraits.isEmpty()) it else it.copy(extraCardInfo = it.extraCardInfo!!.copy(
                            traits = it.extraCardInfo!!.traits.plus(extraTraits)
                    ))
        }.toMap()
        nonMaverickCachedCards = cards.map { it.key to it.value.copy(extraCardInfo = extraInfo[it.key]) }.toMap()
        nonMaverickCachedCardsList = nonMaverickCachedCards?.values?.toList()?.sorted()
        nonMaverickCachedCardsListNoDups = nonMaverickCachedCardsList
                ?.map { it.cardTitle to it }
                ?.toMap()?.values
                ?.toList()
                ?.sortedBy { "${it.house}${it.cardNumber.padStart(4, '0')}" }
        previousInfoWithNames = previousExtraInfo.mapNotNull { entry ->
            val card = nonMaverickCachedCards!![entry.key]
            if (card == null) {
                null
            } else {
                card.cardTitle to card.copy(extraCardInfo = entry.value)
            }
        }.toMap()
        nextInfoWithNames = nextExtraInfo.mapNotNull { entry ->
            val card = nonMaverickCachedCards!![entry.key]
            if (card == null) {
                null
            } else {
                card.cardTitle to card.copy(extraCardInfo = entry.value)
            }
        }.toMap()
    }

    private fun fullCardsFromCards(cards: List<Card>) = cards.map {
        val cardNumber = CardNumberSetPair(it.expansionEnum, it.cardNumber)
        it.copy(
                extraCardInfo = this.extraInfo[cardNumber]
                        ?: throw IllegalStateException("No extra info for ${it.expansion} ${it.cardNumber}")
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
