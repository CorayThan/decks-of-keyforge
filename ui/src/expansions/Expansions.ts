
export interface ExpansionInfo {
    expansionNumber: Expansion
    name: string
    abbreviation: string
    backendEnum: BackendExpansion
}

export enum Expansion {
    COTA = 341,
    AOA = 435
}

export enum BackendExpansion {
    CALL_OF_THE_ARCHONS = "CALL_OF_THE_ARCHONS",
    AGE_OF_ASCENSION = "AGE_OF_ASCENSION",
}

export const expansionInfos: ExpansionInfo[] = [
    {expansionNumber: Expansion.COTA, name: "Call of the Archons", abbreviation: "COTA", backendEnum: BackendExpansion.CALL_OF_THE_ARCHONS},
    {expansionNumber: Expansion.AOA, name: "Age of Ascension", abbreviation: "AOA", backendEnum: BackendExpansion.AGE_OF_ASCENSION},
]

export const expansionInfoMap: Map<number, ExpansionInfo> = new Map(expansionInfos.map(info => (
    [info.expansionNumber, info] as [number, ExpansionInfo]
)))
