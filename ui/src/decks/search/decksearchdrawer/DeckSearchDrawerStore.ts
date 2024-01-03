import { SelectedOrExcludedExpansions } from "../../../expansions/ExpansionSelectOrExclude"
import { expansionInfoMapNumbers } from "../../../expansions/Expansions"
import { SelectedOrExcludedHouses } from "../../../houses/HouseSelectOrExclude"
import { DeckSortSelectStore } from "../../selects/DeckSortSelect"
import { FiltersConstraintsStore } from "../ConstraintDropdowns"
import { DeckFilters } from "../DeckFilters"

class DeckSearchDrawerStore {

    constructor() {
        this.updateValues(new DeckFilters())
    }

    // @ts-ignore
    selectedExpansions: SelectedOrExcludedExpansions
    // @ts-ignore
    selectedHouses: SelectedOrExcludedHouses
    // @ts-ignore
    selectedSortStore:  DeckSortSelectStore
    // @ts-ignore
    constraintsStore: FiltersConstraintsStore

    clear = () => {
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.constraintsStore.reset()
        this.selectedExpansions.reset()
    }
    
    updateValues = (filters: DeckFilters) => {
        this.selectedExpansions = new SelectedOrExcludedExpansions(filters.expansions.map(expNum => expansionInfoMapNumbers.get(expNum)!.backendEnum))
        this.selectedHouses = new SelectedOrExcludedHouses(filters.houses, filters.excludeHouses)
        this.selectedSortStore = new DeckSortSelectStore(filters.sort)
        this.constraintsStore = new FiltersConstraintsStore(filters.constraints)
    }
}

export const deckSearchDrawerStore = new DeckSearchDrawerStore()
