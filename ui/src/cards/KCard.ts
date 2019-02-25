import { House } from "../houses/House"
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

    wins?: number
    losses?: number
    winRate?: number

    extraCardInfo: ExtraCardInfo
}

export const winPercentForCard = (card: KCard): number | undefined => {
    if (card.wins == null || card.losses == null) {
        return undefined
    }
    return (card.wins / (card.wins + card.losses))
}

export interface ExtraCardInfo {
    cardNumber: number
    rating: number
    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number

    traits: string[]
    synergies: SynTraitValue[]
}
