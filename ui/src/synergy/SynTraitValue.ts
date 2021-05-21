import { startCase } from "lodash"
import { SynergyTrait } from "../generated-src/SynergyTrait"
import { SynTraitHouse } from "../generated-src/SynTraitHouse"
import { SynTraitPlayer } from "../generated-src/SynTraitPlayer"
import { SynTraitValue } from "../generated-src/SynTraitValue"

export type SynTraitRatingValues = -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4

export const synTraitValueToString = (value: SynTraitValue) => `${value.trait} – ${value.rating} – ${value.house}`

export const synTraitName = (traitValue: SynTraitValue) => {
    const {trait, player, cardTypes, powersString, cardTraits, cardName, house, synergyGroup, synergyGroupMax, notCardTraits, primaryGroup} = traitValue
    let name: string = trait == SynergyTrait.any ? "" : trait

    if (cardName != null) {
        name = cardName
    }
    let nameEnhancer = ""
    if (powersString.length > 0) {
        nameEnhancer += ` ${powersString} Power`
    }
    if (player && player != SynTraitPlayer.ANY) {
        nameEnhancer += ` ${startCase(player.toLowerCase())}`
    }
    if (cardTraits.length > 0) {
        nameEnhancer += ` ${notCardTraits ? "Non-" : ""}${startCase(cardTraits.join(", ").toLowerCase())}`
    }
    if (cardTypes && cardTypes.length > 0) {
        if (cardTypes.length === 1) {
            nameEnhancer += ` ${cardTypes[0]}s`
        } else {
            nameEnhancer += ` ${cardTypes.map(type => type + "s").join(" ")}`
        }
    }
    if (name.includes("_R_")) {
        name = startCase(name).replace(" R ", nameEnhancer + " ")
    } else {
        name = startCase(name) + " " + nameEnhancer
    }
    if (house === SynTraitHouse.continuous) {
        name = "Omni: " + name
    }
    if (synergyGroup != null) {
        name += ` – ${synergyGroup}${primaryGroup ? "⭑" : ""}`
        if (synergyGroupMax != null) {
            name += ` ${synergyGroupMax > 0 ? "<" : ">"}${synergyGroupMax}%`
        }
    }
    return name.trim()
}
