import { DifferenceAmount } from "../../generated-src/DifferenceAmount"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { DeckType } from "../../generated-src/DeckType";

export interface DeckCompareResults {
    deck: DeckSearchResult
    values: DeckCompareValue[]
}

export interface DeckCompareValue {
    stat: string
    valueDiff: number
    significantlyDifferent: DifferenceAmount
}

export interface DeckNameId {
    keyforgeId: string
    name: string
    type: DeckType
}
