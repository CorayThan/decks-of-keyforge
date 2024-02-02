package coraythan.keyswap.cards.dokcards

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.cards.*
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.cards.extrainfo.ExtraCardInfoRepo
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.GenericDeck
import coraythan.keyswap.decks.models.HouseAndCards
import coraythan.keyswap.decks.models.withBonusIcons
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.sasupdate.SasVersionService
import coraythan.keyswap.users.KeyUser
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DokCardCacheService(
    private val extraCardInfoRepo: ExtraCardInfoRepo,
    private val dokCardRepo: DokCardRepo,
    private val cardRepo: CardRepo,
    private val sasVersionService: SasVersionService,
    private val objectMapper: ObjectMapper,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private var previousCardsCachedByUrlName: Map<String, ExtraCardInfo> = mapOf()

    private var cardsCachedByNumberSet: Map<CardNumberSetPair, ExtraCardInfo> = mapOf()
    private var cardsCachedByUrlName: Map<String, ExtraCardInfo> = mapOf()

    private var futureCardsCachedByNumberSet: Map<CardNumberSetPair, ExtraCardInfo> = mapOf()
    private var futureCardsCachedByUrlName: Map<String, ExtraCardInfo> = mapOf()

    private var tokenCards: Map<String, ExtraCardInfo> = mapOf()
    private var futureTokenCards: Map<String, ExtraCardInfo> = mapOf()

    private var loaded = false

    @Transactional
    fun addCardTexts() {
        log.info("Begin add card texts.")
        val allDokCards = dokCardRepo.findAll()
        val withText = allDokCards.map {
            val card = cardRepo.findFirstByCardTitle(it.cardTitle)
            it.copy(
                cardText = card.cardText,
                flavorText = card.flavorText,
            )
        }
        dokCardRepo.saveAll(withText)
        log.info("End add card texts")
    }

    @Transactional
    fun loadCards() {
        log.info("Begin loading cached cards.")
        val publishedAercVersion = sasVersionService.findSasVersion()
        val currentInfos = extraCardInfoRepo.findByActiveTrue()
        val nextInfos = extraCardInfoRepo.findByPublishedNull()
        val previousInfos = extraCardInfoRepo.findByVersionLessThanAndActiveFalse(publishedAercVersion)

        loadLazyEntities(currentInfos)
        loadLazyEntities(nextInfos)
        loadLazyEntities(previousInfos)

        cardsCachedByUrlName = currentInfos.map { extraInfo ->
            extraInfo.dokCard.cardTitleUrl to extraInfo
        }.toMap()

        log.info("Loading cached cards 1")

        cardsCachedByNumberSet = currentInfos.flatMap { extraInfo ->
            extraInfo.dokCard.expansions
                .map { CardNumberSetPair(it.expansion, it.cardNumber) to extraInfo }
        }.toMap()
        log.info("Loading cached cards 2")

        tokenCards = currentInfos
            .filter { it.dokCard.token }
            .map { extraInfo ->
                extraInfo.dokCard.cardTitle to extraInfo
            }.toMap()

        log.info("Loading cached cards 4")

        previousCardsCachedByUrlName = previousInfos.map { extraInfo ->
            extraInfo.dokCard.cardTitleUrl to extraInfo
        }.toMap()

        log.info("Loading cached cards 5")

        futureCardsCachedByUrlName = nextInfos.map { extraInfo ->
            extraInfo.dokCard.cardTitleUrl to extraInfo
        }.toMap()

        log.info("Loading cached cards 6")

        futureCardsCachedByNumberSet = nextInfos.flatMap { extraInfo ->
            extraInfo.dokCard.expansions
                .map { CardNumberSetPair(it.expansion, it.cardNumber) to extraInfo }
        }.toMap()

        log.info("Loading cached cards 7")

        futureTokenCards = nextInfos
            .filter { it.dokCard.token }
            .map { extraInfo ->
                extraInfo.dokCard.cardTitle to extraInfo
            }.toMap()

        loaded = true
        log.info("Loading cached cards complete.")
    }

    fun currentCards() = if (!loaded) {
        throw IllegalStateException("Site still loading cards")
    } else {
        cardsCachedByUrlName.values.map { it.toCardForFrontend() }
    }

    fun futureCards() = if (!loaded) {
        throw IllegalStateException("Site still loading cards")
    } else {
        futureCardsCachedByUrlName.values.map { it.toCardForFrontend() }
    }

    fun previousCards() = if (!loaded) {
        throw IllegalStateException("Site still loading cards")
    } else {
        previousCardsCachedByUrlName.values.map { it.toCardForFrontend() }
    }

    fun findByCardName(cardName: String) =
        if (!loaded) throw IllegalStateException("Site still loading cards") else cardsCachedByUrlName[cardName.toUrlFriendlyCardTitle()]!!

    fun findByCardNameUrl(cardNameUrl: String) =
        if (!loaded) throw IllegalStateException("Site still loading cards") else cardsCachedByUrlName[cardNameUrl]

//    fun findTokenByName(tokenName: String): DokCardInDeck {
//        if (!loaded) throw IllegalStateException("Site still loading cards")
//        val token = tokenCards[tokenName] ?: throw IllegalStateException("No token for $tokenName")
//        return DokCardInDeck(
//            card = token.dokCard,
//            extraCardInfo = token,
//            house = token.dokCard.houses.first(),
//        )
//    }

    fun twinnedCardsForDeck(deck: Deck): List<DokCardInDeck> {
        if (!loaded) throw IllegalStateException("Site still loading cards")
        return cardsForDeck(deck).map {
            val twin = if (it.card.cardTitle.contains(evilTwinCardName)) {
                val goodTwinName = it.card.cardTitle.dropLast(evilTwinCardName.length)
                findByCardName(goodTwinName)
            } else {
                findByCardName(it.card.cardTitle + evilTwinCardName)
            }
            it.copy(card = twin.dokCard, extraCardInfo = twin)
        }
    }

    fun tokenForDeck(deck: GenericDeck): DokCardInDeck? {
        if (!loaded) throw IllegalStateException("Site still loading cards")
        val deckTokenNum = deck.tokenNumber ?: return null
        val token = tokenCards[TokenCard.cardTitleFromOrdinal(deckTokenNum)] ?: return null
        return DokCardInDeck(
            card = token.dokCard,
            extraCardInfo = token,
            house = token.dokCard.houses.first(),
        )
    }

    fun cardsForDeck(deck: GenericDeck, useFuture: Boolean = false): List<DokCardInDeck> {
        if (!loaded) throw IllegalStateException("Site still loading cards")
        require(deck.cardIds.isNotBlank()) { "Card id string was blank! deck name: ${deck.name}" }
        val cardIds = objectMapper.readValue<CardIds>(deck.cardIds)

        val bonusIcons = deck.bonusIcons()
        val futureCards = futureCardsCachedByNumberSet
        val cards = cardsCachedByNumberSet

        return cardIds
            .cardIds
            .flatMap { entry ->
                entry.value.map { cardNum ->
                    val card = if (useFuture) {
                        futureCards[cardNum.toNew()] ?: cards[cardNum.toNew()]
                        ?: throw IllegalStateException("No card for $cardNum")
                    } else {
                        cards[cardNum.toNew()] ?: throw IllegalStateException("No card for $cardNum")
                    }

                    DokCardInDeck(
                        deck,
                        card,
                        entry.key,
                        Expansion.forExpansionNumber(cardNum.expansion),
                    )
                }
            }
            .withBonusIcons(bonusIcons)
    }

    fun cardsAndTokenFutureProof(deck: GenericDeck, user: KeyUser?): CardsAndToken {
        if (!loaded) throw IllegalStateException("Site still loading cards")
        val cards = cardsForDeck(deck, user?.displayFutureSas() == true)
        val token = if (user?.displayFutureSas() == true) {
            futureTokenForDeck(deck)
        } else {
            tokenForDeck(deck)
        }
        return CardsAndToken(cards, token)
    }

    fun deckToHouseAndCards(deck: GenericDeck): List<HouseAndCards> {
        if (!loaded) throw IllegalStateException("Site still loading cards")
        val houses = deck.houses
        val cards = cardsForDeck(deck)
        return houses
            .map { house ->
                HouseAndCards(
                    house,
                    cards
                        .filter { it.house == house }
                        .sorted()
                        .map {
                            it.toSimpleCard()
                        }
                )
            }
            .sortedBy { it.house }
    }

    private fun futureTokenForDeck(deck: GenericDeck): DokCardInDeck? {
        if (!loaded) throw IllegalStateException("Site still loading cards")
        val deckTokenNum = deck.tokenNumber ?: return null
        val token = futureTokenCards[TokenCard.cardTitleFromOrdinal(deckTokenNum)] ?: return tokenForDeck(deck)
        return DokCardInDeck(
            card = token.dokCard,
            extraCardInfo = token,
            house = token.dokCard.houses.first(),
        )
    }

    private fun loadLazyEntities(loadIn: List<ExtraCardInfo>) {
        loadIn.forEach {
            it.dokCard.expansions.size
            it.traits.size
            it.synergies.size
        }
    }
}

data class CardTexts(
    val cardText: String,
    val flavorText: String?,
)