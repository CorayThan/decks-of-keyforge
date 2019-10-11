package coraythan.keyswap.cards

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.House
import coraythan.keyswap.decks.currentDeckRatingVersion
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.KeyforgeDeck
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.synergy.SynTraitType
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynTraitValueRepo
import coraythan.keyswap.synergy.Synergies
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
        private val extraCardInfoRepo: ExtraCardInfoRepo,
        private val cardIdentifierRepo: CardIdentifierRepo,
        private val synTraitValueRepo: SynTraitValueRepo,
        private val yamlMapper: YAMLMapper,
        private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private var nonMaverickCachedCards: Map<CardNumberSetPairOld, Card>? = null
    private var nonMaverickCachedCardsList: List<Card>? = null
    private var nonMaverickCachedCardsListNoDups: List<Card>? = null
    lateinit var extraInfo: Map<CardNumberSetPairOld, ExtraCardInfoOld>

    fun loadExtraInfo() {
        val read: List<ExtraCardInfoOld> = yamlMapper.readValue(
                ClassPathResource("extra-deck-info-v$currentDeckRatingVersion.yml").inputStream
        )
        val extraInfosFromFile: List<ExtraCardInfoOld> = read.map { it.copy(cardNumbers = it.cardNumbers.map {
            carNum -> CardNumberSetPairOld(carNum.expansion, carNum.cardNumber.padStart(3, '0'))
        }) }

        // Fix card numbers TODO remove this!
        cardRepo.findAll()
                .filter { it.cardNumber.length < 3 }
                .forEach { cardRepo.save(it.copy(cardNumber = it.cardNumber.padStart(3, '0'))) }

        // save new info if needed
        if (extraCardInfoRepo.count() == 0L) {
            extraInfosFromFile.forEach {
                //                val cardNumber = it.cardNumbers.first()
//                val card = cardRepo.findByExpansionAndCardNumberAndMaverickFalse(cardNumber.expansion, cardNumber.cardNumber.toString().padStart(3, '0'))
//                log.info("Found card $card")

                val info = ExtraCardInfo(
                        expectedAmber = it.expectedAmber,
                        amberControl = it.amberControl,
                        creatureControl = it.creatureControl,
                        artifactControl = it.artifactControl,
                        efficiency = it.efficiency,
                        effectivePower = it.effectivePower ?: 0,
                        disruption = it.disruption,
                        amberProtection = it.amberProtection,
                        houseCheating = it.houseCheating,
                        other = it.other,
                        rating = it.rating
                )
                val saved = extraCardInfoRepo.save(info)

                it.cardNumbers.forEach { carNum ->
                    cardIdentifierRepo.save(CardIdentifier(
                            cardNumber = carNum.cardNumber,
                            expansion = Expansion.forExpansionNumber(carNum.expansion),
                            info = saved
                    ))
                }
                it.traits.forEach { trait ->
                    synTraitValueRepo.save(SynTraitValue(trait = trait, traitInfo = saved))
                }
                it.synergies.map { syn ->
                    synTraitValueRepo.save(SynTraitValue(trait = syn.trait, rating = syn.rating, type = syn.type, synergyInfo = saved))
                }

            }
            log.info("Saved new extra card info")
        }

//        this.extraInfo = extraCardInfoRepo.findAll()
//                .map {
//                    when {
//                        it.traits.containsTrait(Synergies.alpha) ->
//                            it.copy(synergies = it.synergies.plus(SynTraitValue(Synergies.alpha, -3, SynTraitType.house)))
//                        it.traits.containsTrait(Synergies.omega) ->
//                            it.copy(synergies = it.synergies.plus(SynTraitValue(Synergies.omega, -3, SynTraitType.house)))
//                        else -> it
//                    }
//                }
//                .flatMap { cardInfo ->
//                    cardInfo.cardNumbers.map {
//                        it.toNumberSetPair() to cardInfo.copy(
//                                synergies = cardInfo.synergies.sorted()
//                        )
//                    }
//                }
//                .toMap()

        this.extraInfo = extraInfosFromFile
                .map {
                    when {
                        it.traits.contains(Synergies.alpha) ->
                            it.copy(synergies = it.synergies.plus(SynTraitValue(Synergies.alpha, -3, SynTraitType.house)))
                        it.traits.contains(Synergies.omega) ->
                            it.copy(synergies = it.synergies.plus(SynTraitValue(Synergies.omega, -3, SynTraitType.house)))
                        else -> it
                    }
                }
                .flatMap { cardInfo ->
                    cardInfo.cardNumbers.map {
                        it to cardInfo.copy(
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

    fun allFullCardsNonMaverickNoDups(): List<Card> {
        if (nonMaverickCachedCardsListNoDups == null) {
            reloadCachedCards()
        }
        return nonMaverickCachedCardsListNoDups!!
    }

    fun allFullCardsNonMaverickMap(): Map<CardNumberSetPairOld, Card> {
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
        val cards = fullCardsFromCards(cardRepo.findByMaverickFalse()).map {
            val synTraitsFromTraits = it.traits
                    .mapNotNull { trait ->
                        Synergies.fromTrait(trait)
                    }
                    //.map { trait -> SynTraitValue(trait = trait) }
            CardNumberSetPairOld(it.expansion, it.cardNumber) to
                    if (synTraitsFromTraits.isEmpty()) it else it.copy(extraCardInfo = it.extraCardInfo!!.copy(traits = it.extraCardInfo!!.traits.plus(synTraitsFromTraits)))
        }.toMap()

        nonMaverickCachedCards = cards.map { it.key to it.value.copy(extraCardInfo = extraInfo[it.key]) }.toMap()
        nonMaverickCachedCardsList = nonMaverickCachedCards?.values?.toList()?.sorted()
        nonMaverickCachedCardsListNoDups = nonMaverickCachedCardsList
                ?.map { it.cardTitle to it }
                ?.toMap()?.values
                ?.toList()
                ?.sortedBy { "${it.house}${it.cardNumber.padStart(4, '0')}" }

    }

    private fun fullCardsFromCards(cards: List<Card>) = cards.map {
        it.copy(extraCardInfo = this.extraInfo[CardNumberSetPairOld(it.expansion, it.cardNumber)]
                ?: throw IllegalStateException("No extra info for ${it.expansion} ${it.cardNumber}"))
    }

    private fun cardsFromCardIds(cardIdsString: String, deckId: String? = null): List<Card> {
        if (cardIdsString.isBlank()) {
            throw IllegalArgumentException("Card id string was blank! deck id: $deckId")
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
