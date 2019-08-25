import { KCard } from "../cards/KCard"
import { House } from "../houses/House"
import { DeckSynergyInfo } from "../synergy/DeckSynergyInfo"
import { UserDeck } from "../userdeck/UserDeck"
import { DeckSaleInfo } from "./sales/DeckSaleInfo"

export interface DeckWithSynergyInfo {
    deck: Deck
    deckSynergyInfo: DeckSynergyInfo
    cardRatingPercentile: number
    synergyPercentile: number
    antisynergyPercentile: number
}

export interface Deck {

    id: number
    keyforgeId: string
    name: string
    expansion: number
    powerLevel: number
    chains: number
    wins: number
    losses: number

    registered: boolean

    maverickCount: number
    specialsCount: number
    raresCount: number
    uncommonsCount: number

    rawAmber: number
    totalPower: number
    creatureCount: number
    actionCount: number
    artifactCount: number
    upgradeCount: number

    cardDrawCount: number
    cardArchiveCount: number
    keyCheatCount: number
    totalArmor: number

    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number
    deckManipulation: number
    effectivePower: number
    aercScore: number
    previousSasRating: number
    sasRating: number
    cardsRating: number
    synergyRating: number
    antisynergyRating: number

    forSale: boolean
    forTrade: boolean
    forAuction: boolean
    wishlistCount: number
    funnyCount: number

    sasPercentile?: number

    userDecks: UserDeck[]

    searchResultCards?: KCard[]
    houses: House[]

    deckSaleInfo?: DeckSaleInfo[]

    owners?: string[]
}

export class DeckUtils {
    static cardsInHouses = (deck: Deck) => {
        const cardsByHouse: { house: House, cards: KCard[] }[] = []
        deck.houses
            .forEach((house) => {
                const cards = deck.searchResultCards!.filter(card => card.house === house)
                cardsByHouse.push({house, cards})
            })
        return cardsByHouse
    }

    static arrayToCSV = (decks: Deck[]) => {
        const data = decks.map(deck => {

            return [
                deck.name.replace(/"/g, "\"\""),
                deck.houses,
                deck.expansion,
                deck.sasRating,
                deck.cardsRating,
                deck.synergyRating,
                deck.antisynergyRating,
                deck.sasPercentile,
                deck.aercScore,
                deck.amberControl,
                deck.expectedAmber,
                deck.artifactControl,
                deck.creatureControl,
                deck.deckManipulation,
                deck.effectivePower,

                deck.creatureCount,
                deck.actionCount,
                deck.artifactCount,
                deck.upgradeCount,

                deck.rawAmber,
                deck.keyCheatCount,
                deck.cardDrawCount,
                deck.cardArchiveCount,
                deck.totalPower,
                deck.totalArmor,

                deck.powerLevel,
                deck.chains,
                deck.wins,
                deck.losses,

                deck.forSale,
                deck.forAuction,
                deck.forTrade,
                deck.searchResultCards == null ? "" : `${deck.searchResultCards.map(card => card.cardTitle).join(", ")}`,
                deck.wishlistCount,
                deck.funnyCount,
                `https://decksofkeyforge.com/decks/${deck.keyforgeId}`,
                `https://www.keyforgegame.com/deck-details/${deck.keyforgeId}`
            ]
        })
        data.unshift([
            "Name",
            "Houses",
            "Expansion",
            "Sas Rating",
            "Cards Rating",
            "Synergy Rating",
            "Antisynergy Rating",
            "Sas Percentile",
            "Aerc Score",
            "Amber Control",
            "Expected Amber",
            "Artifact Control",
            "Creature Control",
            "Deck Manipulation",
            "Effective Power",

            "Creature Count",
            "Action Count",
            "Artifact Count",
            "Upgrade Count",

            "Raw Amber",
            "Key Cheat Count",
            "Card Draw Count",
            "Card Archive Count",
            "Total Power",
            "Total Armor",

            "Power Level",
            "Chains",
            "Wins",
            "Losses",

            "For Sale",
            "For Auction",
            "For Trade",

            "Cards",
            "Wishlist",
            "Funny",
            "DoK Link",
            "Master Vault Link"
        ])
        return data
    }
}

export interface DeckPage {
    decks: Deck[]
    page: number
}

export interface DeckCount {
    pages: number
    count: number
}
