import { startCase } from "lodash"
import { CardType } from "../cards/CardType"
import { SynergyTrait } from "../extracardinfo/SynergyTrait"
import { SynTraitHouse } from "./SynTraitHouse"

export interface SynTraitValue {
    trait: SynergyTrait
    rating: SynTraitRatingValues
    house: SynTraitHouse
    player: SynTraitPlayer
    cardTypes: CardType[]
    powersString: string
    cardTraits: string[]
    cardName?: string
    id?: string
}

export enum SynTraitPlayer {
    ANY = "ANY",
    FRIENDLY = "FRIENDLY",
    ENEMY = "ENEMY",
}

export type SynTraitRatingValues = -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4

export const synTraitValueToString = (value: SynTraitValue) => `${value.trait} – ${value.rating} – ${value.house}`

export const synTraitName = (traitValue: SynTraitValue) => {
    const {trait, player, cardTypes, powersString, cardTraits, cardName} = traitValue
    if (cardName != null) {
        return cardName
    }
    let name: string = trait == SynergyTrait.any ? "" : trait
    let nameEnhancer = ""
    if (powersString.length > 0) {
        nameEnhancer += ` ${powersString} Power`
    }
    if (player && player != SynTraitPlayer.ANY) {
        nameEnhancer += ` ${startCase(player.toLowerCase())}`
    }
    if (cardTraits.length > 0) {
        nameEnhancer += ` ${startCase(cardTraits.join(", ").toLowerCase())}`
    }
    if (cardTypes && cardTypes.length > 0) {
        if (cardTypes.length === 1) {
            nameEnhancer += ` ${cardTypes[0]}s`
        } else {
            nameEnhancer += ` ${cardTypes.map(type => type + "s").join(" ")}`
        }
    }
    if (name.includes("_R_")) {
        name = startCase(name).replace("_R_", nameEnhancer)
    } else {
        name = startCase(name) + " " + nameEnhancer
    }
    return name.trim()
}