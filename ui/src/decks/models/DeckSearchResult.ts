import { HasAerc } from "../../aerc/HasAerc"
import { log, roundToHundreds } from "../../config/Utils"
import { BackendExpansion } from "../../expansions/Expansions"
import { CsvData } from "../../generic/CsvDownloadButton"
import { House } from "../../houses/House"
import { DeckSynergyInfo, SynergyCombo } from "../../synergy/DeckSynergyInfo"
import { userStore } from "../../user/UserStore"
import { UserDeck } from "../../userdeck/UserDeck"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { DeckSaleInfo } from "../sales/DeckSaleInfo"
import { HouseAndCards } from "./HouseAndCards"

export interface DeckWithSynergyInfo {
    deck: DeckSearchResult
    cardRatingPercentile: number
    synergyPercentile: number
    antisynergyPercentile: number
}

export interface DeckSearchResult extends HasAerc {

    id: number
    keyforgeId: string
    name: string
    expansion: BackendExpansion
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

    aercScore: number
    previousSasRating?: number
    previousMajorSasRating?: number
    sasRating: number
    synergyRating: number
    antisynergyRating: number

    forSale: boolean
    forTrade: boolean
    forAuction: boolean
    wishlistCount: number
    funnyCount: number

    lastSasUpdate: string

    sasPercentile: number

    userDecks: UserDeck[]

    housesAndCards: HouseAndCards[]

    deckSaleInfo?: DeckSaleInfo[]

    owners?: string[]

    synergies?: DeckSynergyInfo

    dateAdded?: string

}

export class DeckUtils {

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

    static hasAercFromDeck = (deck: DeckSearchResult): HasAerc => {
        if (deck.synergies == null) {
            log.warn("Synergies shouldnt' be null!")
            return deck
        }
        return {
            aercScore: deck.synergies.rawAerc,
            ...deck.synergies
        }
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

    static synergiesRounded = (synergies: DeckSynergyInfo) => {
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
            const synergies = DeckUtils.synergiesRounded(deck.synergies!)
            return [
                deck.name,
                deck.housesAndCards.map(houseAndCards => houseAndCards.house),
                deck.expansion,
                synergies.sasRating,
                synergies.synergyRating,
                synergies.antisynergyRating,
                deck.sasPercentile,
                synergies.rawAerc,
                synergies.amberControl,
                synergies.expectedAmber,
                synergies.creatureProtection,
                synergies.artifactControl,
                synergies.creatureControl,
                synergies.effectivePower,
                synergies.efficiency,
                synergies.disruption,
                synergies.other,

                DeckUtils.sasForHouse(synergies.synergyCombos, undefined, deck.housesAndCards[0].house),
                DeckUtils.sasForHouse(synergies.synergyCombos, undefined, deck.housesAndCards[1].house),
                DeckUtils.sasForHouse(synergies.synergyCombos, undefined, deck.housesAndCards[2].house),

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
