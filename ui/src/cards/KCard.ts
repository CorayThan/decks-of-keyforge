import { House } from "../houses/House"
import { HasAerc } from "../stats/AercScoreView"
import { SynTraitValue } from "../synergy/SynTraitValue"
import { CardType } from "./CardType"
import { Rarity } from "./rarity/Rarity"

export interface KCard {
    id: string
    cardTitle: string
    house: House
    cardType: CardType
    frontImage: string
    cardText: string
    traits: string[]
    amber: number
    power: number
    armor: number
    rarity: Rarity
    flavorText?: string
    cardNumber: number
    expansion: number
    maverick: boolean
    effectivePower: number

    wins?: number
    losses?: number
    winRate?: number
    aercScore?: number

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
    const {amberControl, expectedAmber, creatureControl, artifactControl, deckManipulation} = extraCardInfo

    return {
        amberControl, expectedAmber, creatureControl, artifactControl, deckManipulation, aercScore: aercScore == null ? 0 : aercScore,
        effectivePower
    }
}

export interface ExtraCardInfo {
    cardNumber: number
    setNumbers: number[]
    rating: number
    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number
    deckManipulation: number

    traits: string[]
    synergies: SynTraitValue[]
}
