import { HasAerc } from "../aerc/HasAerc"
import { roundToHundreds } from "../config/Utils"
import { ExtraCardInfo } from "../extracardinfo/ExtraCardInfo"
import { House } from "../houses/House"
import { synTraitValueToString } from "../synergy/SynTraitValue"
import { HasFrontImage } from "./CardSimpleView"
import { CardType } from "./CardType"
import { Rarity } from "./rarity/Rarity"

export interface KCard {
    id: string
    cardTitle: string
    house: House
    frontImage: string
    cardType: CardType
    cardText: string
    traits: string[]
    amber: number
    power: number
    armor: number
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
    const {extraCardInfo, effectivePower, aercScore, aercScoreMax} = card
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

export class CardUtils {

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

    static arrayToCSV = (cards: KCard[]) => {
        const data = cards.map(card => {

            return [
                card.cardTitle,
                card.house,
                card.extraCardInfo.cardNumbers.map(numbers => `${numbers.expansion} – ${numbers.cardNumber}`).join(" | "),
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
                card.power,
                card.armor,
                card.wins,
                card.losses,

                card.extraCardInfo.traits.join(" | "),
                card.extraCardInfo.synergies.map(value => synTraitValueToString(value)).join(" | "),
                card.traits,
                card.cardText.replace(/"/g, "\"\""),
                card.flavorText == null ? "" : card.flavorText.replace(/"/g, "\"\"")
            ]
        })
        data.unshift([
            "Name",
            "House",
            "Expansion – #",
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