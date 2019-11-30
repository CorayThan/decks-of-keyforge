import { SynergyTrait } from "../extracardinfo/SynergyTrait"

export interface SynTraitValue {
    trait: SynergyTrait
    rating: SynTraitRatingValues
    type: SynTraitType
    cardName?: string
    id?: string
}

export enum SynTraitType {
    anyHouse = "anyHouse",
    // Only synergizes with traits inside its house
    house = "house",
    outOfHouse = "outOfHouse",
}

export type SynTraitRatingValues = -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4

export const synTraitValueToString = (value: SynTraitValue) => `${value.trait} – ${value.rating} – ${value.type}`
