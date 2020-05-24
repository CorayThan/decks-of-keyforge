import { round } from "lodash"
import { HasAerc } from "../aerc/HasAerc"
import { roundToHundreds } from "../config/Utils"
import { activeExpansions, BackendExpansion } from "../expansions/Expansions"
import { ExtraCardInfo } from "../extracardinfo/ExtraCardInfo"
import { CsvData } from "../generic/CsvDownloadButton"
import { House } from "../houses/House"
import { Wins } from "../stats/GlobalStats"
import { statsStore } from "../stats/StatsStore"
import { synTraitValueToString } from "../synergy/SynTraitValue"
import { HasFrontImage } from "./CardSimpleView"
import { cardStore } from "./CardStore"
import { CardType } from "./CardType"
import { Rarity } from "./rarity/Rarity"

export interface KCard {
    id: string
    cardTitle: string
    house: House
    frontImage: string
    cardType: CardType
    cardText: string
    traits?: string[]
    amber: number
    power: number
    armor: number
    powerString: string
    armorString: string
    rarity: Rarity
    flavorText?: string
    cardNumber: string
    expansion: number
    maverick: boolean
    anomaly: boolean
    effectivePower: number

    wins?: number
    losses?: number
    winRate?: number

    /**
     * Key is BackendExpansion
     */
    expansionWins?: { [key: string]: Wins }

    aercScore: number
    aercScoreMax?: number

    extraCardInfo: ExtraCardInfo
}

export const winPercentForCard = (card: KCard): number | undefined => {
    if (card.wins == null || card.losses == null) {
        return undefined
    }
    return (card.wins / (card.wins + card.losses))
}

export const hasAercFromCard = (card: KCard): HasAerc => {
    const {effectivePower, aercScore, aercScoreMax} = card
    const extraCardInfo = cardStore.findExtraInfoToUse(card)
    const {
        amberControl, expectedAmber, creatureControl, artifactControl, efficiency, amberProtection, disruption, houseCheating, other,
        amberControlMax, expectedAmberMax, creatureControlMax, artifactControlMax, efficiencyMax, effectivePowerMax, amberProtectionMax, disruptionMax, houseCheatingMax, otherMax
    } = extraCardInfo

    let averageAercScore = card.aercScore
    if (card.aercScoreMax != null) {
        averageAercScore = roundToHundreds((card.aercScore + card.aercScoreMax) / 2)
    }

    return {
        amberControl,
        expectedAmber,
        creatureControl,
        artifactControl,
        efficiency,
        effectivePower,
        amberProtection,
        disruption,
        houseCheating,
        other,
        amberControlMax,
        expectedAmberMax,
        creatureControlMax,
        artifactControlMax,
        efficiencyMax,
        effectivePowerMax,
        amberProtectionMax,
        disruptionMax,
        houseCheatingMax,
        otherMax,
        aercScoreMax: aercScoreMax == null ? undefined : roundToHundreds(aercScoreMax),
        aercScore: roundToHundreds(aercScore),
        averageAercScore
    }
}

const cardNameReplacementRegex = /[^\d\w\s]/g
const spaceRegex = /\s/g
export const cardNameToCardNameKey = (name: string) => {
    return name.replace(cardNameReplacementRegex, "")
        .replace(spaceRegex, "-")
        .toLowerCase()
}

export const findCardImageUrl = (card: HasFrontImage) => {
    // if (card.expansion === Expansion.WC || card.expansion === Expansion.ANOM) {
    //     return card.frontImage
    // }
    return `https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/${cardNameToCardNameKey(card.cardTitle)}.png`
}

export interface CardWinRates {
    expansion?: BackendExpansion
    winRatePercent?: number
    relativeToAveragePercent?: number
    wins?: number
    losses?: number

}

export class CardUtils {

    static cardAverageRelativeWinRate = (card: KCard): number => {

        const winRates = CardUtils.cardWinRates(card)
            .map(winRate => winRate.relativeToAveragePercent)
            .filter(rate => rate != null)

        if (winRates.length === 0) {
            return 0
        }

        return winRates.reduce(function (prev, current) {
            return prev! + current!
        })! / winRates.length
    }

    static cardWinRates = (card: KCard): CardWinRates[] => {
        const winRates: CardWinRates[] = []
        const expansionWins = card.expansionWins

        if (expansionWins != null) {
            activeExpansions.forEach(expansion => {
                const wins = expansionWins[expansion]
                if (wins != null && (wins.wins + wins.losses > 1000)) {
                    const winRatePercent = CardUtils.calcWinRate(wins.wins, wins.losses)
                    const expHouseWinPercent = statsStore.winRateForExpansionAndHouse(expansion, card.house)
                    let relativeToAveragePercent
                    if (expHouseWinPercent != null) {
                        relativeToAveragePercent = round(winRatePercent - expHouseWinPercent, 1)
                    }
                    winRates.push({
                        expansion,
                        wins: wins.wins,
                        losses: wins.losses,
                        winRatePercent: round(winRatePercent, 1),
                        relativeToAveragePercent
                    })
                }
            })
        }

        const totalWinRate = card.winRate
        if (totalWinRate != null && winRates.length !== 1) {
            winRates.unshift({
                winRatePercent: round(totalWinRate * 100, 1),
                wins: card.wins,
                losses: card.losses,
            })
        }

        return winRates
    }

    private static calcWinRate = (wins: number, losses: number) => {
        return (wins / (wins + losses)) * 100
    }

    static fakeRatingFromAerc = (card: HasAerc) => {
        const aerc = card.averageAercScore!
        if (aerc <= 0.5) {
            return 0
        } else if (aerc <= 1) {
            return 1
        } else if (aerc <= 2) {
            return 2
        } else if (aerc <= 3) {
            return 3
        }
        return 4
    }

    static arrayToCSV = (cards: KCard[]): CsvData => {
        const data = cards.map(card => {

            return [
                card.cardTitle,
                card.house,
                card.extraCardInfo.cardNumbers.map(numbers => `${numbers.expansion} – ${numbers.cardNumber}`),
                card.cardType,
                card.rarity,
                card.aercScore,
                card.aercScoreMax,
                card.extraCardInfo.amberControl,
                card.extraCardInfo.amberControlMax,
                card.extraCardInfo.expectedAmber,
                card.extraCardInfo.expectedAmberMax,
                card.extraCardInfo.amberProtection,
                card.extraCardInfo.amberProtectionMax,
                card.extraCardInfo.artifactControl,
                card.extraCardInfo.artifactControlMax,
                card.extraCardInfo.creatureControl,
                card.extraCardInfo.creatureControlMax,
                card.effectivePower,
                card.extraCardInfo.effectivePowerMax,
                card.extraCardInfo.efficiency,
                card.extraCardInfo.efficiencyMax,
                card.extraCardInfo.disruption,
                card.extraCardInfo.disruptionMax,
                card.extraCardInfo.houseCheating,
                card.extraCardInfo.houseCheatingMax,
                card.extraCardInfo.other,
                card.extraCardInfo.otherMax,

                card.amber,
                card.powerString,
                card.armorString,
                card.wins,
                card.losses,

                card.extraCardInfo.traits.map(trait => synTraitValueToString(trait)),
                card.extraCardInfo.synergies.map(value => synTraitValueToString(value)),
                card.traits,
                card.cardText,
                card.flavorText
            ]
        })
        data.unshift([
            "Name",
            "House",
            "Expansion – #",
            "Type",
            "Rarity",
            "Aerc Min",
            "Aerc Max",
            "Amber Control",
            "Amber Control Max",
            "Expected Amber",
            "Expected Amber Max",
            "Aember Protection",
            "Aember Protection Max",
            "Artifact Control",
            "Artifact Control Max",
            "Creature Control",
            "Creature Control Max",
            "Effective Power",
            "Effective Power Max",
            "Efficiency",
            "Efficiency Max",
            "Disruption",
            "Disruption Max",
            "House Cheating",
            "House Cheating Max",
            "Other",
            "Other Max",

            "Raw Amber",
            "Power",
            "Armor",

            "Wins",
            "Losses",

            "SAS traits",
            "Synergies",

            "Traits",
            "Text",
            "Flavor Text"
        ])
        return data
    }
}
