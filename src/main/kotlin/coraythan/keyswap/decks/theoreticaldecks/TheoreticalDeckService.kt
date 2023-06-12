package coraythan.keyswap.decks.theoreticaldecks

import coraythan.keyswap.House
import coraythan.keyswap.alliancedecks.AllianceDeckHouses
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckImporterService
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckBuildingData
import coraythan.keyswap.decks.models.DeckWithSynergyInfo
import coraythan.keyswap.decks.models.TheoryCard
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.firstWord
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.users.CurrentUserService
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class TheoreticalDeckService(
    private val theoreticalDeckRepo: TheoreticalDeckRepo,
    private val deckSearchService: DeckSearchService,
    private val deckImporterService: DeckImporterService,
    private val cardService: CardService,
    private val currentUserService: CurrentUserService,
    private val deckRepo: DeckRepo,
) {

    fun saveAllianceDeck(toSave: AllianceDeckHouses): UUID {
        val user = currentUserService.hasPatronLevelOrUnauthorized(PatreonRewardsTier.NOTICE_BARGAINS)

        val deckOne = deckRepo.findByKeyforgeId(toSave.houseOneDeckId) ?: throw BadRequestException("No deck for ${toSave.houseOneDeckId}")
        val deckTwo = deckRepo.findByKeyforgeId(toSave.houseTwoDeckId) ?: throw BadRequestException("No deck for ${toSave.houseTwoDeckId}")
        val deckThree = deckRepo.findByKeyforgeId(toSave.houseThreeDeckId) ?: throw BadRequestException("No deck for ${toSave.houseThreeDeckId}")

        val deckName = "Alliance of " +
                "${deckOne.name.firstWord()} " +
                "${deckTwo.name.firstWord()} " +
                deckThree.name.firstWord()

        val allianceDeckInfo = DeckBuildingData(
            name = deckName,
            cards = mapOf(
                deckToHouseCardsPair(deckOne, toSave.houseOne),
                deckToHouseCardsPair(deckTwo, toSave.houseTwo),
                deckToHouseCardsPair(deckThree, toSave.houseThree),
            ),
            tokenId = toSave.tokenId,
        )

        val deck = deckImporterService.viewTheoreticalDeck(allianceDeckInfo)
        val makeBelieveDeck = TheoreticalDeck(
            cardIds = deck.cardIds,
            houseNamesString = deck.houseNamesString,
            creatorId = user.id,
            alliance = true,
            deckName = deckName
        )
        return theoreticalDeckRepo.save(makeBelieveDeck).id
    }

    fun saveTheoreticalDeck(toSave: DeckBuildingData): UUID {
        val user = currentUserService.hasPatronLevelOrUnauthorized(PatreonRewardsTier.NOTICE_BARGAINS)
        val deck = deckImporterService.viewTheoreticalDeck(toSave)
        val makeBelieveDeck = TheoreticalDeck(
            expansion = deck.expansion,
            cardIds = deck.cardIds,
            houseNamesString = deck.houseNamesString,
            creatorId = user.id,
            alliance = false,
        )
        return theoreticalDeckRepo.save(makeBelieveDeck).id
    }

    fun findTheoreticalDeck(id: UUID): DeckWithSynergyInfo {
        val theoryDeck =
            theoreticalDeckRepo.findByIdOrNull(id) ?: throw BadRequestException("No theoretical deck for id $id")
        return theoryDeckToRealDeck(theoryDeck)
    }

    fun findMyTheoreticalDecks(alliance: Boolean): List<DeckWithSynergyInfo> {
        val user = currentUserService.loggedInUserOrUnauthorized()
        return theoreticalDeckRepo.findByCreatorIdAndAlliance(user.id, alliance).map { theoryDeckToRealDeck(it) }
    }

    fun deleteTheoreticalDeck(id: UUID) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val theoreticalDeck = theoreticalDeckRepo.findByIdOrNull(id) ?: throw BadRequestException("No theoretical deck for id $id")
        if (theoreticalDeck.creatorId != user.id) throw UnauthorizedException("You must have created the theoretical deck to delete it.")
        theoreticalDeckRepo.deleteById(id)
    }

    private fun theoryDeckToRealDeck(theoryDeck: TheoreticalDeck): DeckWithSynergyInfo {
        val deck = Deck(
            name = theoryDeck.deckName ?: "The One that Theoretically Exists",
            expansion = theoryDeck.expansion ?: Expansion.CALL_OF_THE_ARCHONS.expansionNumber,
            keyforgeId = theoryDeck.id.toString(),
            cardIds = theoryDeck.cardIds,
            houseNamesString = theoryDeck.houseNamesString
        )
        val withCards = deck.withCards(
            cardService.cardsForDeck(deck)
        )
        val rated = deckImporterService.rateDeck(withCards)
        val deckResult = deckSearchService.deckToDeckWithSynergies(rated.first)

        val cardsWithoutLegacies = deckResult.deck.housesAndCards.map {
            it.copy(cards = it.cards.map { it.copy(legacy = false) })
        }

        return deckResult.copy(
            deck = deckResult.deck.copy(housesAndCards = cardsWithoutLegacies)
        )
    }

    private fun deckToHouseCardsPair(deck: Deck, house: House): Pair<House, List<TheoryCard>> {
        val deckCards = cardService.cardsForDeck(deck)
        return house to deckCards
            .filter { it.house == house }
            .map { TheoryCard(it.cardTitle, it.enhanced ?: false) }
    }
}
