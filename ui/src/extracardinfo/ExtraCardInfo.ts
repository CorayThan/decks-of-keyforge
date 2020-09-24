import { CardType } from "../cards/CardType"
import { SynTraitValue } from "../synergy/SynTraitValue"

export interface ExtraCardInfo {
    cardName: string
    rating: number
    expectedAmber: number
    expectedAmberMax?: number
    amberControl: number
    amberControlMax?: number
    creatureControl: number
    creatureControlMax?: number
    artifactControl: number
    artifactControlMax?: number
    efficiency: number
    efficiencyMax?: number
    effectivePower: number
    effectivePowerMax?: number
    disruption: number
    disruptionMax?: number
    creatureProtection: number
    creatureProtectionMax?: number
    other: number
    otherMax?: number

    adaptiveScore: number

    enhancementAmber: number
    enhancementCapture: number
    enhancementDraw: number
    enhancementDamage: number

    /**
     * In Zoned Date Time format
     */
    published: string
    publishedDate: string

    extraCardTypes?: CardType[]
    traits: SynTraitValue[]
    synergies: SynTraitValue[]

    version: number
    active: boolean

    id: string
}
