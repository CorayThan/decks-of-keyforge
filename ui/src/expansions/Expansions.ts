
export interface ExpansionInfo {
    expansionNumber: Expansion
    name: string
    abbreviation: string
    backendEnum: BackendExpansion
}

export enum Expansion {
    COTA = 341,
    AOA = 435,
    WC = 452
}

export enum BackendExpansion {
    CALL_OF_THE_ARCHONS = "CALL_OF_THE_ARCHONS",
    AGE_OF_ASCENSION = "AGE_OF_ASCENSION",
    WORLDS_COLLIDE = "WORLDS_COLLIDE",
}

export const activeExpansions = [BackendExpansion.CALL_OF_THE_ARCHONS, BackendExpansion.AGE_OF_ASCENSION]

export const expansionInfos: ExpansionInfo[] = [
    {expansionNumber: Expansion.COTA, name: "Call of the Archons", abbreviation: "COTA", backendEnum: BackendExpansion.CALL_OF_THE_ARCHONS},
    {expansionNumber: Expansion.AOA, name: "Age of Ascension", abbreviation: "AOA", backendEnum: BackendExpansion.AGE_OF_ASCENSION},
    {expansionNumber: Expansion.WC, name: "Worlds Collide", abbreviation: "WC", backendEnum: BackendExpansion.WORLDS_COLLIDE},
]

export const expansionInfoMap: Map<BackendExpansion, ExpansionInfo> = new Map(expansionInfos.map(info => (
    [info.backendEnum, info] as [BackendExpansion, ExpansionInfo]
)))

export const expansionInfoMapNumbers: Map<number, ExpansionInfo> = new Map(expansionInfos.map(info => (
    [info.expansionNumber, info] as [number, ExpansionInfo]
)))