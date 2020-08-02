package coraythan.keyswap.cards

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.cards.cardwins.CardWinsService
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.HouseAndCards
import coraythan.keyswap.decks.models.KeyforgeDeck
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.TraitStrength
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

// Manually update this when publishing a new version of AERC. Also rerates all decks
val publishedAercVersion = 22
val majorRevision = false

@Transactional
@Service
class CardService(
        private val cardRepo: CardRepo,
        private val keyforgeApi: KeyforgeApi,
        private val extraCardInfoRepo: ExtraCardInfoRepo,
        private val cardWinsService: CardWinsService,
        private val versionService: CardsVersionService,
        private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private val cardNameReplacementRegex = "[^\\d\\w\\s]".toRegex()
    private val spaceRegex = "\\s".toRegex()

    private var previousInfoWithNames: Map<String, Card>? = null
    private var nextInfoWithNames: Map<String, Card>? = null
    private var nonMaverickCachedCards: Map<CardNumberSetPair, Card>? = null
    private var nonMaverickCachedCardsWithNames: Map<String, Card>? = null
    private var nonMaverickCachedCardsWithUrlNames: Map<String, Card>? = null
    private var nonMaverickCachedCardsList: List<Card>? = null
    private var nonMaverickCachedCardsListNoDups: List<Card>? = null
    lateinit var previousExtraInfo: Map<String, ExtraCardInfo>
    lateinit var extraInfo: Map<String, ExtraCardInfo>
    lateinit var nextExtraInfo: Map<String, ExtraCardInfo>
    var activeAercVersion: Int = 0

    fun publishNextInfo() {
        log.info("Publishing next extra info started")

        try {
            val currentInfo = mapInfos(extraCardInfoRepo.findByActiveTrue())
            this.activeAercVersion = currentInfo.maxBy { it.value.version }?.value?.version ?: 0

            log.info("Active aerc version $activeAercVersion published version $publishedAercVersion")
            if (activeAercVersion < publishedAercVersion) {

                val toPublish = mapInfos(extraCardInfoRepo.findByVersion(publishedAercVersion))
                toPublish.forEach {
                    it.value.active = true
                    it.value.published = ZonedDateTime.now()
                }
                val unpublish = toPublish.mapNotNull {
                    val oldInfo = currentInfo[it.key]
                    oldInfo?.active = false
                    oldInfo
                }

                val updated = toPublish.map { it.value }.plus(unpublish)
                extraCardInfoRepo.saveAll(updated)
                versionService.revVersion()
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

    private fun mapInfos(extraInfos: List<ExtraCardInfo>) = extraInfos
            .map { cardInfo ->
                cardInfo.synergies.size
                cardInfo.traits.size
                cardInfo.cardName.cleanCardName() to cardInfo
            }
            .toMap()

    fun findByExpansionCardName(expansion: Int, cardName: String) = cardRepo.findByExpansionAndCardTitle(expansion, cardName).firstOrNull()
    fun findByCardName(cardName: String) = nonMaverickCachedCardsWithNames!![cardName.cleanCardName()]
    fun findByCardUrlName(cardUrlName: String) = nonMaverickCachedCardsWithUrlNames!![cardUrlName]

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

    fun deckToHouseAndCards(deck: Deck): List<HouseAndCards> {
        val houses = deck.houses
        val cardIdsString = deck.cardIds
        val cards = cardsFromCardIds(cardIdsString)
        return houses
                .map { house ->
                    HouseAndCards(
                            house,
                            cards
                                    .filter { it.house == house }
                                    .sorted()
                                    .map { it.toSimpleCard(!(it.cardNumbers?.any { cardNum -> cardNum.expansion == deck.expansionEnum }?: true) ) }
                    )
                }
                .sortedBy { it.house }
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

    fun importNewCards(decks: List<KeyforgeDeck>) {
        decks.forEach { deck ->
            if (deck.cards == null || deck.cards.isEmpty()) {
                log.warn("Deck from keyforge api didn't have cards!? ${deck.id}")
            }
            if (deck.cards?.any { !cardRepo.existsById(it) } == true) {
                keyforgeApi.findDeck(deck.id)?._linked?.cards?.forEach {
                    if (!cardRepo.existsById(it.id)) {
                        this.saveNewCard(it.toCard(this.extraInfo))
                    }
                }
                reloadCachedCards()
                versionService.revVersion()
                log.debug("Loaded cards from deck.")
            }
        }
    }

    fun saveNewCard(card: Card): Card {
        if (card.extraCardInfo == null) {
            throw IllegalStateException("extra info not found for ${card.cardTitle} id ${card.id} expansion ${card.expansion} num ${card.cardNumber}")
        }
        return cardRepo.save(card)
    }

    fun reloadCachedCards() {

        val cards = fullCardsFromCards(
                cardRepo.findAll()
                        .groupBy { "${it.expansion}-${it.cardNumber}" }
                        .values
                        .map { groupedCards ->
                            groupedCards.let { sameCards ->
                                val nonMav = sameCards.filter { !it.maverick && !it.anomaly }
                                if (nonMav.isEmpty()) {
                                    val first = sameCards.first()
                                    val representativeCard = if (first.big == true) sameCards.first { it.power > 0 } else first
                                    representativeCard.houses = listOf()
                                    representativeCard
                                } else {
                                    val first = nonMav.first()
                                    val representativeCard = if (first.big == true) sameCards.first { it.power > 0 } else first
                                    representativeCard.houses = nonMav.map { it.house }.toSet().toList().sorted()
                                    representativeCard
                                }
                            }
                        }
        ).map {
            val extraTraits = it.traits
                    .mapNotNull { trait ->
                        SynergyTrait.fromTrait(trait)
                    }
                    .map { trait -> SynTraitValue(trait = trait) }
                    .plus(
                            if (it.aercScoreAverage >= 2.5) {
                                listOf((SynTraitValue(
                                        trait = SynergyTrait.good,
                                        house = SynTraitHouse.anyHouse,
                                        cardTypesInitial = listOf(it.cardType),
                                        rating = when {
                                            it.aercScoreAverage >= 3.5 -> TraitStrength.STRONG.value
                                            it.aercScoreAverage >= 3 -> TraitStrength.NORMAL.value
                                            else -> TraitStrength.WEAK.value
                                        }
                                )))
                            } else {
                                listOf()
                            }
                    )

            val numberSetPair = CardNumberSetPair(it.expansionEnum, it.cardNumber)
            val realExtraInfo = extraInfo[it.cardTitle.cleanCardName()] ?: error("no extra info for ${it.cardTitle}")

            val extraSynergies = realExtraInfo.traits
                    .mapNotNull { synTrait ->
                        when (synTrait.trait) {
                            SynergyTrait.alpha -> SynTraitValue(SynergyTrait.alpha, -3, SynTraitHouse.house)
                            SynergyTrait.omega -> SynTraitValue(SynergyTrait.omega, -3, SynTraitHouse.house)
                            else -> null
                        }
                    }

            numberSetPair to
                    it.copy(extraCardInfo = realExtraInfo.copy(
                            traits = realExtraInfo.traits.plus(extraTraits),
                            synergies = realExtraInfo.synergies.plus(extraSynergies)
                    ))
        }.toMap()

        val cardExpansions = cards.entries
                .groupBy { it.value.cardTitle }
                .map { it.key to it.value.map { cardNums -> cardNums.key } }
                .toMap()

        cards.forEach {
            it.value.cardNumbers = cardExpansions[it.value.cardTitle]
        }

        nonMaverickCachedCards = cards
        nonMaverickCachedCardsWithNames = cards.map { it.value.cardTitle.cleanCardName() to it.value }.toMap()
        nonMaverickCachedCardsWithUrlNames = cards.map { cardNameToCardImageUrl(it.value.cardTitle) to it.value }.toMap()
        val notNullCards = nonMaverickCachedCards?.values?.toList()?.sorted()
        nonMaverickCachedCardsList = notNullCards
        if (notNullCards != null) cardWinsService.addWinsToCards(notNullCards)
        nonMaverickCachedCardsListNoDups = nonMaverickCachedCardsList
                ?.map { it.cardTitle.cleanCardName() to it }
                ?.toMap()?.values
                ?.toList()
                ?.sortedBy { "${it.house}${it.cardNumber.padStart(4, '0')}" }
        previousInfoWithNames = previousExtraInfo.mapNotNull { entry ->
            val card = nonMaverickCachedCardsWithNames!![entry.key]
            if (card == null) {
                null
            } else {
                card.cardTitle.cleanCardName() to card.copy(extraCardInfo = entry.value)
            }
        }.toMap()
        nextInfoWithNames = nextExtraInfo.mapNotNull { entry ->
            val card = nonMaverickCachedCardsWithNames!![entry.key]
            if (card == null) {
                null
            } else {
                card.cardTitle.cleanCardName() to card.copy(extraCardInfo = entry.value)
            }
        }.toMap()
    }

    private fun fullCardsFromCards(cards: List<Card>) = cards.map {
        it.copy(
                extraCardInfo = this.extraInfo[it.cardTitle.cleanCardName()]
                        ?: throw IllegalStateException("No extra info for ${it.cardTitle}")
        )
    }

    private fun cardsFromCardIds(cardIdsString: String, deckId: String? = null): List<Card> {
        require(!cardIdsString.isBlank()) { "Card id string was blank! deck id: $deckId" }
        val cardIds = objectMapper.readValue<CardIds>(cardIdsString)
        val realCards = allFullCardsNonMaverickMap()
        return cardIds.cardIds.flatMap { entry ->
            entry.value.map {
                val realCard = realCards[it.toNew()] ?: throw java.lang.IllegalStateException("No card for ${it.toNew()}")
                realCard.copy(house = entry.key, maverick = !realCard.anomaly && !(realCard.houses?.contains(entry.key) ?: true), enhanced = it.enhanced)
            }
        }
    }

    private fun cardNameToCardImageUrl(cardName: String): String {
        return cardName
                .replace(cardNameReplacementRegex, "")
                .replace(spaceRegex, "-")
                .toLowerCase()
    }
}

val nonAlphanumericSpaceRegex = "[^a-zA-Z0-9\\s\\-,]".toRegex()
fun String.cleanCardName() = this.replace(nonAlphanumericSpaceRegex, "")
