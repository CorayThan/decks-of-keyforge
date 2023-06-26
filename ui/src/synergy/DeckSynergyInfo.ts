import { SynergyCombo } from "../generated-src/SynergyCombo"
import { TokenCreationValues } from "../generated-src/TokenCreationValues"

export interface DeckSynergyInfo {
    rawAerc: number
    sasRating: number
    synergyRating: number
    antisynergyRating: number
    synergyCombos: SynergyCombo[]

    expectedAmber: number,
    amberControl: number,
    creatureControl: number,
    artifactControl: number,
    efficiency: number,
    recursion: number,
    effectivePower: number,
    creatureProtection: number,
    disruption: number,
    other: number,

    metaScores: { [key: string]: number }
    tokenCreationValues: TokenCreationValues
}
