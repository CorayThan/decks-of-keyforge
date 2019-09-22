export interface SynTraitValue {
    trait: string
    rating: number
    type: string
    id: string
}

export const synTraitValueToString = (value: SynTraitValue) => `${value.trait} – ${value.rating} – ${value.type}`
