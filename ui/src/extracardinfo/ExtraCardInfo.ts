import { CardType } from "../generated-src/CardType"
import { SynTraitValue } from "../generated-src/SynTraitValue"

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
    recursion: number
    recursionMax?: number
    effectivePower: number
    effectivePowerMax?: number
    disruption: number
    disruptionMax?: number
    creatureProtection: number
    creatureProtectionMax?: number
    other: number
    otherMax?: number

    baseSynPercent?: number
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
