import { cardStore } from "../../cards/CardStore"
import { EnhancementType } from "../../cards/EnhancementType"
import { KCard } from "../../cards/KCard"
import { log, roundToHundreds } from "../../config/Utils"
import { ExtendedExpansionUtils } from "../../expansions/ExtendedExpansionUtils"
import { DeckSaleInfo } from "../../generated-src/DeckSaleInfo"
import { Expansion } from "../../generated-src/Expansion"
import { House } from "../../generated-src/House"
import { HouseAndCards } from "../../generated-src/HouseAndCards"
import { SynergyCombo } from "../../generated-src/SynergyCombo"
import { SynergyTrait } from "../../generated-src/SynergyTrait"
import { CsvData } from "../../generic/CsvDownloadButton"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { DeckType } from "../../generated-src/DeckType"
import { AllianceHouseInfo } from "../../generated-src/AllianceHouseInfo"
import { TokenInfo } from "../../generated-src/TokenInfo"

export interface DeckWithSynergyInfo {
    deck: DeckSearchResult
    cardRatingPercentile: number
    synergyPercentile: number
    antisynergyPercentile: number
    alliance: boolean
}

export interface DeckSearchResult {

    deckType: DeckType
    id: number
    keyforgeId: string
    expansion: Expansion

    name: string

    creatureCount?: number
    actionCount?: number
    artifactCount?: number
    upgradeCount?: number

    powerLevel?: number
    chains?: number
    wins?: number
    losses?: number

    aercScore: number
    previousSasRating?: number
    previousMajorSasRating?: number
    sasRating: number
    synergyRating: number
    antisynergyRating: number
    metaScores?: { [key: string]: number }
    efficiencyBonus: number

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

    lastSasUpdate?: string
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
    recursion?: number
    effectivePower: number
    creatureProtection?: number
    disruption?: number
    other?: number

    twinId?: string
    tokenInfo?: TokenInfo

    allianceHouses?: AllianceHouseInfo[]
    validAlliance?: boolean
    discoveredBy?: string
}

export interface DeckIdentifyingInfo {
    id: number
    keyforgeId: string
    deckType: DeckType
    name: string
}

export interface TraitInDeckInfo {
    trait: SynergyTrait
    count: number
    strength: number
    houseCounts: Map<House, number>
}

export class DeckUtils {

    static calculateBonusIcons = (deck: DeckSearchResult): Map<EnhancementType, number> | undefined => {
        if (ExtendedExpansionUtils.allowsEnhancements(deck.expansion)) {

            let enhancedAmber = 0
            let enhancedCapture = 0
            let enhancedDamage = 0
            let enhancedDraw = 0

            const cards = deck.housesAndCards
                .flatMap(house => house.cards.map(simpleCard => cardStore.fullCardFromCardName(simpleCard.cardTitle)))
                .filter(card => card != null) as KCard[]


            cards.forEach(card => {
                enhancedAmber += card.extraCardInfo.enhancementAmber
                enhancedCapture += card.extraCardInfo.enhancementCapture
                enhancedDamage += card.extraCardInfo.enhancementDamage
                enhancedDraw += card.extraCardInfo.enhancementDraw
            })

            if (enhancedAmber + enhancedCapture + enhancedDamage + enhancedDraw === 0) {
                return undefined
            }

            const enhancements = new Map<EnhancementType, number>()
            enhancements.set(EnhancementType.AEMBER, enhancedAmber)
            enhancements.set(EnhancementType.CAPTURE, enhancedCapture)
            enhancements.set(EnhancementType.DAMAGE, enhancedDamage)
            enhancements.set(EnhancementType.DRAW, enhancedDraw)

            return enhancements
        }

        return undefined
    }

    static calculateMetaScore = (deck: DeckSearchResult) => {
        return Object.entries(deck.metaScores ?? {})
            .map(meta => meta[1])
            .reduce((metaScore, nextMetaScore) => metaScore + nextMetaScore, 0)
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

    static traits = (deck: DeckSearchResult): Map<SynergyTrait, TraitInDeckInfo> => {
        const traitsInDeck: Map<SynergyTrait, TraitInDeckInfo> = new Map()
        const houses = deck.housesAndCards.map(houseAndCards => houseAndCards.house)
        deck.housesAndCards.forEach(houseAndCards => {
            houseAndCards.cards.forEach(card => {
                const fullCard = cardStore.fullCardFromCardName(card.cardTitle)
                fullCard?.extraCardInfo?.traits?.forEach(trait => {
                    let traitInDeck = traitsInDeck.get(trait.trait)
                    if (traitInDeck == null) {
                        const newTrait = {
                            trait: trait.trait,
                            count: 0,
                            strength: 0,
                            houseCounts: new Map()
                        }
                        traitsInDeck.set(trait.trait, newTrait)
                        traitInDeck = newTrait
                        houses.forEach(house => {
                            newTrait.houseCounts.set(house, 0)
                        })
                    }
                    log.info("Add trait " + trait.trait)
                    traitInDeck.count += 1
                    traitInDeck.strength += trait.rating
                    traitInDeck.houseCounts.set(houseAndCards.house, traitInDeck.houseCounts.get(houseAndCards.house)! + 1)
                })
            })
        })
        log.info("Trait size " + traitsInDeck.size)
        return traitsInDeck
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
            recursion,
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
            recursion: roundToHundreds(recursion),
            disruption: roundToHundreds(disruption),
            other: roundToHundreds(other),
            ...rest
        }
    }

    static arrayToCSV = (decks: DeckSearchResult[]): CsvData => {
        log.debug("Perform deck array to csv")

        const data = decks.map(deck => {
            const synergies = DeckUtils.synergiesRounded(deck)
            const enhancements = DeckUtils.calculateBonusIcons(deck)
            return [
                deck.name,
                deck.housesAndCards.map(houseAndCards => houseAndCards.house),
                deck.expansion,
                synergies.sasRating,
                synergies.synergyRating,
                synergies.antisynergyRating,
                deck.sasPercentile,
                synergies.aercScore,
                DeckUtils.calculateMetaScore(deck),
                synergies.amberControl,
                synergies.expectedAmber,
                synergies.creatureProtection,
                synergies.artifactControl,
                synergies.creatureControl,
                synergies.effectivePower,
                synergies.efficiency,
                synergies.recursion,
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
                enhancements?.get(EnhancementType.CAPTURE) ?? 0,
                enhancements?.get(EnhancementType.DAMAGE) ?? 0,
                enhancements?.get(EnhancementType.DRAW) ?? 0,

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

                (deck.id != null && userDeckStore.notesForDeck(deck.id)) ?? ""
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
            "META Score",
            "Amber Control",
            "Expected Amber",
            "Creature Protection",
            "Artifact Control",
            "Creature Control",
            "Effective Power",
            "Efficiency",
            "Recursion",
            "Disruption",
            "Other",

            "House 1 SAS",
            "House 2 SAS",
            "House 3 SAS",

            "Creature Count",
            "Action Count",
            "Artifact Count",
            "Upgrade Count",

            "Bonus Amber",
            "Bonus Capture",
            "Bonus Damage",
            "Bonus Draw",

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
