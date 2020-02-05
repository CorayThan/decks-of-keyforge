import { Deck } from "@material-ui/icons"
import { HasAerc } from "../aerc/HasAerc"
import { KCard } from "../cards/KCard"
import { log, roundToHundreds } from "../config/Utils"
import { BackendExpansion } from "../expansions/Expansions"
import { House } from "../houses/House"
import { DeckSynergyInfo } from "../synergy/DeckSynergyInfo"
import { userStore } from "../user/UserStore"
import { UserDeck } from "../userdeck/UserDeck"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { DeckSaleInfo } from "./sales/DeckSaleInfo"

export interface DeckWithSynergyInfo {
    deck: Deck
    cardRatingPercentile: number
    synergyPercentile: number
    antisynergyPercentile: number
}

export interface Deck extends HasAerc {

    id: number
    keyforgeId: string
    name: string
    expansion: BackendExpansion
    powerLevel: number
    chains: number
    wins: number
    losses: number
    crucibleTrackerWins?: number
    crucibleTrackerLosses?: number

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
    previousSasRating: number
    sasV3?: number
    sasRating: number
    synergyRating: number
    antisynergyRating: number

    forSale: boolean
    forTrade: boolean
    forAuction: boolean
    wishlistCount: number
    funnyCount: number

    lastSasUpdate: string

    sasPercentile?: number

    userDecks: UserDeck[]

    houses: House[]

    deckSaleInfo?: DeckSaleInfo[]

    owners?: string[]

    synergies?: DeckSynergyInfo

}

export class DeckUtils {

    static findPrice = (deck: Deck, myPriceOnly?: boolean): number | undefined => {
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

    static findHighestBid = (deck: Deck): number | undefined => {
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

    static hasAercFromDeck = (deck: Deck): HasAerc => {
        if (deck.synergies == null) {
            log.warn("Synergies shouldnt' be null!")
            return deck
        }
        return {
            aercScore: deck.synergies.rawAerc,
            ...deck.synergies
        }
    }

    static cardsInHouses = (deck: Deck) => {
        const cardsByHouse: { house: House, cards: KCard[] }[] = []
        deck.houses
            .forEach((house) => {
                const cards = deck.searchResultCards!.filter(card => card.house === house)
                cardsByHouse.push({house, cards})
            })
        return cardsByHouse
    }

    static synergiesRounded = (synergies: DeckSynergyInfo) => {
        const {
            amberControl,
            expectedAmber,
            amberProtection,
            artifactControl,
            creatureControl,
            effectivePower,
            efficiency,
            disruption,
            houseCheating,
            other,
            ...rest
        } = synergies
        return {
            amberControl: roundToHundreds(amberControl),
            expectedAmber: roundToHundreds(expectedAmber),
            amberProtection: roundToHundreds(amberProtection),
            artifactControl: roundToHundreds(artifactControl),
            creatureControl: roundToHundreds(creatureControl),
            effectivePower: roundToHundreds(effectivePower),
            efficiency: roundToHundreds(efficiency),
            disruption: roundToHundreds(disruption),
            houseCheating: roundToHundreds(houseCheating),
            other: roundToHundreds(other),
            ...rest
        }
    }

    static arrayToCSV = (decks: Deck[]) => {
        const data = decks.map(deck => {
            const synergies = DeckUtils.synergiesRounded(deck.synergies!)
            return [
                deck.name.replace(/"/g, "\"\""),
                deck.houses,
                deck.expansion,
                synergies.sasRating,
                synergies.synergyRating,
                synergies.antisynergyRating,
                deck.sasPercentile,
                synergies.rawAerc,
                synergies.amberControl,
                synergies.expectedAmber,
                synergies.amberProtection,
                synergies.artifactControl,
                synergies.creatureControl,
                synergies.effectivePower,
                synergies.efficiency,
                synergies.disruption,
                synergies.houseCheating,
                synergies.other,

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
                deck.searchResultCards == null ? "" : `${deck.searchResultCards.map(card => card.cardTitle).join("|")}`,
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
            "Aember Protection",
            "Artifact Control",
            "Creature Control",
            "Effective Power",
            "Efficiency",
            "Disruption",
            "House Cheating",
            "Other",

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

            "Cards",
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
    decks: Deck[]
    page: number
}

export interface DeckCount {
    pages: number
    count: number
}
