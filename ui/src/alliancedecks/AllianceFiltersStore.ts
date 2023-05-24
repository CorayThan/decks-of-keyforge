import {makeObservable, observable} from "mobx";
import {SortDirection} from "../generated-src/SortDirection";
import {SelectedOrExcludedExpansions} from "../expansions/ExpansionSelectOrExclude";
import {expansionInfoMapNumbers} from "../expansions/Expansions";
import {SelectedOrExcludedHouses} from "../houses/HouseSelectOrExclude";
import {AllianceDeckSortSelectStore} from "./AllianceDeckSortSelect";
import {AllianceDeckFilters} from "../generated-src/AllianceDeckFilters";

class AllianceFiltersStore {

    @observable
    title = ""
    @observable
    teamDecks = false
    @observable
    owners: string[] = []
    @observable
    currentPage = 0
    @observable
    pageSize = 20
    @observable
    sortDirection = SortDirection.DESC

    selectedExpansions = new SelectedOrExcludedExpansions([], [])
    selectedHouses = new SelectedOrExcludedHouses([], [])
    selectedSortStore = new AllianceDeckSortSelectStore()

    constructor() {
        makeObservable(this)
    }

    updateFilters = (filters: AllianceDeckFilters) => {
        this.title = filters.title
        this.teamDecks = filters.teamDecks
        this.owners = filters.owners
        this.pageSize = filters.pageSize
        this.sortDirection = filters.sortDirection

        this.selectedExpansions = new SelectedOrExcludedExpansions(filters.expansions.map(expNum => expansionInfoMapNumbers.get(expNum)!.backendEnum))
        this.selectedHouses = new SelectedOrExcludedHouses(filters.houses, filters.excludeHouses)
        this.selectedSortStore = new AllianceDeckSortSelectStore(filters.sort)
    }

    reset = () => {
        this.title = ""
        this.teamDecks = false
        this.owners = []
        this.currentPage = 0
        this.sortDirection = SortDirection.DESC

        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.selectedExpansions.reset()
    }

    makeFilters = () => {
        return {
            page: 0,
            pageSize: this.pageSize,
            sort: this.selectedSortStore.toEnumValue(),
            sortDirection: this.sortDirection,
            teamDecks: this.teamDecks,
            title: this.title,
            owners: this.owners,

            expansions: this.selectedExpansions.excludedExpansionsAsNumberArray(),
            houses: this.selectedHouses.getHousesSelectedTrue(),
            excludeHouses: this.selectedHouses.getHousesExcludedTrue(),
        }
    }

}

export const allianceFiltersStore = new AllianceFiltersStore()
