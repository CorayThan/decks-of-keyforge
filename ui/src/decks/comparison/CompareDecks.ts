import { DeckSearchResult } from "../models/DeckSearchResult"

export interface DeckCompareResults {
    deck: DeckSearchResult
    values: DeckCompareValue[]
}

export interface DeckCompareValue {
    stat: string
    valueDiff: number
    significantlyDifferent: boolean
}

export interface DeckNameId {
    keyforgeId: string
    name: string
}
