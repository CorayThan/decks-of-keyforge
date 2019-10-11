import { HasAerc } from "../aerc/HasAerc"
import { BackendExpansion } from "../expansions/Expansions"
import { House } from "../houses/House"
import { SynTraitValue, synTraitValueToString } from "../synergy/SynTraitValue"
import { HasFrontImage } from "./CardSimpleView"
import { CardType } from "./CardType"
import { Rarity } from "./rarity/Rarity"

export interface KCard {
    id: string
    cardTitle: string
    house: House
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
    effectivePower: number

    wins?: number
    losses?: number
    winRate?: number
    aercScore: number

    extraCardInfo: ExtraCardInfo
}

export const winPercentForCard = (card: KCard): number | undefined => {
    if (card.wins == null || card.losses == null) {
        return undefined
    }
    return (card.wins / (card.wins + card.losses))
}

export const hasAercFromCard = (card: KCard): HasAerc => {
    const {extraCardInfo, effectivePower, aercScore} = card
    const {amberControl, expectedAmber, creatureControl, artifactControl, efficiency, amberProtection, disruption, houseCheating, other} = extraCardInfo

    return {
        amberControl,
        expectedAmber,
        creatureControl,
        artifactControl,
        efficiency,
        aercScore: aercScore == null ? 0 : (Math.round(aercScore * 10) / 10),
        effectivePower,
        amberProtection,
        disruption,
        houseCheating,
        other
    }
}

export interface ExtraCardInfo {
    cardNumbers: CardIdentifier[]
    rating: number
    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number
    efficiency: number
    disruption: number
    amberProtection: number
    houseCheating: number
    other: number

    traits: SynTraitValue[]
    synergies: SynTraitValue[]
}

export interface CardIdentifier {
    expansion: BackendExpansion
    cardNumber: string
}

const cardNameReplacementRegex = /[^\d\w\s]/g
const spaceRegex = /\s/g
export const cardNameToCardNameKey = (name: string) => {
    return name.replace(cardNameReplacementRegex, "")
        .replace(spaceRegex, "-")
        .toLowerCase()
}

export const findCardImageUrl = (card: HasFrontImage) =>
    `https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/${cardNameToCardNameKey(card.cardTitle)}.png`

export class CardUtils {
    static arrayToCSV = (cards: KCard[]) => {
        const data = cards.map(card => {

            return [
                card.cardTitle,
                card.house,
                card.extraCardInfo.cardNumbers.map(numbers => `${numbers.expansion} – ${numbers.cardNumber}`).join(" | "),
                card.aercScore,
                card.extraCardInfo.amberControl,
                card.extraCardInfo.expectedAmber,
                card.extraCardInfo.amberProtection,
                card.extraCardInfo.artifactControl,
                card.extraCardInfo.creatureControl,
                card.effectivePower,
                card.extraCardInfo.efficiency,
                card.extraCardInfo.disruption,
                card.extraCardInfo.houseCheating,
                card.extraCardInfo.other,

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
            "Aerc Score",
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