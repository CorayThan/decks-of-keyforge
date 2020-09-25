import { cardStore } from "../../cards/CardStore"
import { roundToHundreds } from "../../config/Utils"
import { DeckSaleInfo } from "../../generated-src/DeckSaleInfo"
import { Expansion } from "../../generated-src/Expansion"
import { House } from "../../generated-src/House"
import { HouseAndCards } from "../../generated-src/HouseAndCards"
import { CsvData } from "../../generic/CsvDownloadButton"
import { SynergyCombo } from "../../synergy/DeckSynergyInfo"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"

export interface DeckWithSynergyInfo {
    deck: DeckSearchResult
    cardRatingPercentile: number
    synergyPercentile: number
    antisynergyPercentile: number
}

export interface DeckSearchResult {

    id: number
    keyforgeId: string
    expansion: Expansion

    name: string

    creatureCount?: number
    actionCount?: number
    artifactCount?: number
    upgradeCount?: number

    registered: boolean

    powerLevel?: number
    chains?: number
    wins?: number
    losses?: number

    aercScore: number
    previousSasRating: number
    previousMajorSasRating?: number
    sasRating: number
    synergyRating: number
    antisynergyRating: number
    adaptiveScore: number

    totalPower: number
    cardDrawCount?: number
    cardArchiveCount?: number
    keyCheatCount?: number
    rawAmber: number
    totalArmor?: number

    forSale?: boolean
    forTrade?: boolean
    forAuction?: boolean
    wishlistCount?: number
    funnyCount?: number

    lastSasUpdate: string
    sasPercentile: number

    housesAndCards: HouseAndCards[]
    deckSaleInfo?: DeckSaleInfo[]
    owners?: string[]
    synergyDetails?: SynergyCombo[]
    hasOwnershipVerification: boolean
    dateAdded?: string

    amberControl: number
    expectedAmber: number
    artifactControl?: number
    creatureControl: number
    efficiency?: number
    effectivePower: number
    creatureProtection?: number
    disruption?: number
    other?: number

}

export class DeckUtils {

    static calculateAdaptiveScore = (deck: DeckSearchResult) => {
        return deck.housesAndCards
            .flatMap(houseWithCards => houseWithCards.cards)
            .map(card => cardStore.nextAdaptiveScore(card.cardTitle))
            .reduce((adaptiveScore, nextAdaptiveScore) => adaptiveScore + nextAdaptiveScore)
    }

    static calculateAdaptiveScoreContributions = (deck: DeckSearchResult) => {
        return deck.housesAndCards
            .flatMap(houseWithCards => houseWithCards.cards)
            .filter(card => cardStore.nextAdaptiveScore(card.cardTitle) !== 0)
            .map(card => `${card.cardTitle} = ${cardStore.nextAdaptiveScore(card.cardTitle)}`)
            .join("\n")
    }

    static findPrice = (deck: DeckSearchResult, myPriceOnly?: boolean): number | undefined => {
        const saleInfo = deck.deckSaleInfo
        if (saleInfo && saleInfo.length > 0) {
            for (const info of saleInfo) {
                if (!myPriceOnly || info.username === userStore.username) {
                    return info.buyItNow
                }
            }
        }
        return undefined
    }

    static findHighestBid = (deck: DeckSearchResult): number | undefined => {
        const saleInfo = deck.deckSaleInfo
        if (saleInfo && saleInfo.length > 0) {
            for (const info of saleInfo) {
                if (info.highestBid != null) {
                    return info.highestBid
                }
            }
        }
        return undefined
    }

    static sasForHouse = (combos: SynergyCombo[], accessor?: (combo: SynergyCombo) => number, house?: House): number => {
        let filteredCombos = combos
        if (house != null) {
            filteredCombos = combos.filter(combo => combo.house === house)
        }
        return filteredCombos.length === 0 ? 0 : filteredCombos
            .map(combo => (accessor == null ? combo.aercScore : accessor(combo)) * combo.copies)
            .reduce((prev, next) => prev + next)
    }

    static synergiesRounded = (synergies: DeckSearchResult) => {
        const {
            amberControl,
            expectedAmber,
            creatureProtection,
            artifactControl,
            creatureControl,
            effectivePower,
            efficiency,
            disruption,
            other,
            ...rest
        } = synergies
        return {
            amberControl: roundToHundreds(amberControl),
            expectedAmber: roundToHundreds(expectedAmber),
            creatureProtection: roundToHundreds(creatureProtection),
            artifactControl: roundToHundreds(artifactControl),
            creatureControl: roundToHundreds(creatureControl),
            effectivePower: roundToHundreds(effectivePower),
            efficiency: roundToHundreds(efficiency),
            disruption: roundToHundreds(disruption),
            other: roundToHundreds(other),
            ...rest
        }
    }

    static arrayToCSV = (decks: DeckSearchResult[]): CsvData => {
        const data = decks.map(deck => {
            const synergies = DeckUtils.synergiesRounded(deck)
            return [
                deck.name,
                deck.housesAndCards.map(houseAndCards => houseAndCards.house),
                deck.expansion,
                synergies.sasRating,
                synergies.synergyRating,
                synergies.antisynergyRating,
                deck.sasPercentile,
                synergies.aercScore,
                synergies.amberControl,
                synergies.expectedAmber,
                synergies.creatureProtection,
                synergies.artifactControl,
                synergies.creatureControl,
                synergies.effectivePower,
                synergies.efficiency,
                synergies.disruption,
                synergies.other,

                DeckUtils.sasForHouse(synergies.synergyDetails!, undefined, deck.housesAndCards[0].house),
                DeckUtils.sasForHouse(synergies.synergyDetails!, undefined, deck.housesAndCards[1].house),
                DeckUtils.sasForHouse(synergies.synergyDetails!, undefined, deck.housesAndCards[2].house),

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
                DeckUtils.findPrice(deck),
                deck.housesAndCards[0].cards.map(card => card.cardTitle),
                deck.housesAndCards[1].cards.map(card => card.cardTitle),
                deck.housesAndCards[2].cards.map(card => card.cardTitle),
                deck.wishlistCount,
                deck.funnyCount,
                `https://decksofkeyforge.com/decks/${deck.keyforgeId}`,
                `https://www.keyforgegame.com/deck-details/${deck.keyforgeId}`,
                deck.lastSasUpdate,

                userDeckStore.notesForDeck(deck.id) ?? ""
            ]
        })
        data.unshift([
            "Name",
            "Houses",
            "Expansion",
            "Sas Rating",
            "Synergy Rating",
            "Antisynergy Rating",
            "Sas Percentile",
            "Raw Aerc Score",
            "Amber Control",
            "Expected Amber",
            "Creature Protection",
            "Artifact Control",
            "Creature Control",
            "Effective Power",
            "Efficiency",
            "Disruption",
            "Other",

            "House 1 SAS",
            "House 2 SAS",
            "House 3 SAS",

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
            "Price",

            "House 1 Cards",
            "House 2 Cards",
            "House 3 Cards",
            "Wishlist",
            "Funny",
            "DoK Link",
            "Master Vault Link",
            "Last SAS Update",

            "My Notes"
        ])
        return data
    }
}

export interface DeckPage {
    decks: DeckSearchResult[]
    page: number
}

export interface DeckCount {
    pages: number
    count: number
}
