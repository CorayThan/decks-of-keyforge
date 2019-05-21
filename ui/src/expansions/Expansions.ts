
export interface ExpansionInfo {
    expansionNumber: number
    name: string
    abbreviation: string
}

export const expansionInfos: ExpansionInfo[] = [
    {expansionNumber: 341, name: "Call of the Archons", abbreviation: "COTA"},
    {expansionNumber: 435, name: "Age of Ascension", abbreviation: "AOA"},
]

const expansionNumberStrings = expansionInfos.map(info => info.expansionNumber.toString())

export const expansionInfoMap: Map<number, ExpansionInfo> = new Map(expansionInfos.map(info => (
    [info.expansionNumber, info] as [number, ExpansionInfo]
)))
