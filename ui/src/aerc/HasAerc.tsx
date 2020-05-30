export interface HasAerc {
    amberControl: number
    expectedAmber: number
    artifactControl: number
    creatureControl: number
    efficiency: number
    effectivePower: number
    creatureProtection: number
    disruption: number
    other: number
    aercScore: number

    amberControlMax?: number
    expectedAmberMax?: number
    artifactControlMax?: number
    creatureControlMax?: number
    efficiencyMax?: number
    effectivePowerMax?: number
    creatureProtectionMax?: number
    disruptionMax?: number
    otherMax?: number
    aercScoreMax?: number

    averageAercScore?: number
}
