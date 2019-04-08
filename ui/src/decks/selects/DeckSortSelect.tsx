import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

@observer
export class DeckSortSelect extends React.Component<{ store: DeckSortSelectStore }> {
    render() {
        const options = this.props.store.forSaleOrTrade ? forSaleDeckSortOptions : deckSortOptions
        return (<KeySelect name={"Sort By"} options={options.map(option => option.name)} selected={this.props.store}/>)
    }
}

export class DeckSortSelectStore implements SelectedStore {

    @observable
    selectedValue: string

    @observable
    forSaleOrTrade: boolean

    constructor(forSaleOrTrade: boolean, initialSort?: string) {
        if (initialSort) {
            this.selectedValue = forSaleDeckSortOptions.filter(option => option.value === initialSort)[0].name
        } else {
            this.selectedValue = defaultSort.name
        }
        this.forSaleOrTrade = forSaleOrTrade
    }

    toEnumValue = () => {
        if (!this.selectedValue) {
            return defaultSort.value
        }
        return forSaleDeckSortOptions.filter(option => option.name === this.selectedValue)[0].value
    }
}

export interface SortOption {
    name: string
    value: string
}

export const DeckSorts = {
    sas: "SAS_RATING",
    aerc: "AERC_SCORE",
    funniest: "FUNNIEST",
    wishlisted: "MOST_WISHLISTED",
    chains: "CHAINS",
    recentlyListed: "RECENTLY_LISTED"
}

const deckSortOptions: SortOption[] = [
    {value: "ADDED_DATE", name: "Date Added"},
    {value: DeckSorts.sas, name: "SAS Rating"},
    {value: "CARDS_RATING", name: "Card Rating"},
    {value: DeckSorts.aerc, name: "AERC Score"},
    {value: DeckSorts.chains, name: "Chains"},
    {value: DeckSorts.funniest, name: "Funniest"},
    {value: DeckSorts.wishlisted, name: "Most Wishlisted"},
    {value: "NAME", name: "Name"},
]

const forSaleDeckSortOptions: SortOption[] = deckSortOptions.slice()
forSaleDeckSortOptions.push({value: DeckSorts.recentlyListed, name: "Recently Listed"})

export const defaultSort = deckSortOptions[1]
