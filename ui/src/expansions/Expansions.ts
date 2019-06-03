
export interface ExpansionInfo {
    expansionNumber: Expansion
    name: string
    abbreviation: string
}

export enum Expansion {
    COTA = 341,
    AOA = 435
}

export const expansionInfos: ExpansionInfo[] = [
    {expansionNumber: Expansion.COTA, name: "Call of the Archons", abbreviation: "COTA"},
    {expansionNumber: Expansion.AOA, name: "Age of Ascension", abbreviation: "AOA"},
]

const expansionNumberStrings = expansionInfos.map(info => info.expansionNumber.toString())

export const expansionInfoMap: Map<number, ExpansionInfo> = new Map(expansionInfos.map(info => (
    [info.expansionNumber, info] as [number, ExpansionInfo]
)))
