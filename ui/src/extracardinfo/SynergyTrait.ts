/* eslint-disable @typescript-eslint/camelcase */
import { startCase } from "lodash"
import { Utils } from "../config/Utils"
import { SynergyTrait } from "../generated-src/SynergyTrait"

const allSynergyTraits = Utils.enumValues(SynergyTrait) as SynergyTrait[]
const firstSpecialIndex = allSynergyTraits.indexOf(SynergyTrait.bonusAmber)
export const specialTraits = allSynergyTraits.slice(firstSpecialIndex, allSynergyTraits.length)

export const noSynTraits = [SynergyTrait.card]

export const validSynergies = allSynergyTraits
export const validTraits = (Utils.enumValues(SynergyTrait) as SynergyTrait[])
    .filter(traitValue => !specialTraits.includes(traitValue as SynergyTrait))

export const traitOptions = validTraits.map(trait => ({label: startCase(trait).replace(" R ", " ??? "), value: trait}))
export const synergyOptions = validSynergies.map(trait => ({label: startCase(trait).replace(" R ", " ??? "), value: trait}))
