import { SynergyTrait } from "../extracardinfo/SynergyTrait"

export interface SynTraitValue {
    trait: SynergyTrait
    rating: SynTraitRatingValues
    type: SynTraitType
    id?: string
}

export enum SynTraitType {
    anyHouse = "anyHouse",
    // Only synergizes with traits inside its house
    house = "house",
    outOfHouse = "outOfHouse",
}

export type SynTraitRatingValues = -3 | -2 | -1 | 1 | 2 | 3

export const synTraitValueToString = (value: SynTraitValue) => `${value.trait} – ${value.rating} – ${value.type}`
