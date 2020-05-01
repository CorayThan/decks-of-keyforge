import { CardType } from "../cards/CardType"
import { SynergyTrait } from "../extracardinfo/SynergyTrait"
import { SynTraitHouse } from "./SynTraitHouse"

export interface SynTraitValue {
    trait: SynergyTrait
    rating: SynTraitRatingValues
    house: SynTraitHouse
    player: SynTraitPlayer
    cardTypes: CardType[]
    cardName?: string
    id?: string
}

export enum SynTraitPlayer {
    FRIENDLY = "FRIENDLY",
    ENEMY = "ENEMY",
    ANY = "ANY"
}

export type SynTraitRatingValues = -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4

export const synTraitValueToString = (value: SynTraitValue) => `${value.trait} – ${value.rating} – ${value.house}`
