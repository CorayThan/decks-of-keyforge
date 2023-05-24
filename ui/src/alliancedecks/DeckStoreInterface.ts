import { DeckSearchResult } from "../decks/models/DeckSearchResult";

export interface DeckStoreInterface {
    addingMoreDecks: boolean
    searchingForDecks: boolean
    countingDecks: boolean
    moreDecksAvailable: () => boolean | undefined
    showMoreDecks: () => Promise<void>
    displayDecks: () => DeckSearchResult[] | undefined
}
