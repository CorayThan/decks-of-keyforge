import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { log } from "../../config/Utils"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

@observer
export class DeckSortSelect extends React.Component<{ store: DeckSortSelectStore }> {
    render() {
        let options = deckSortOptions

        const {forSaleOrTrade, forAuction, completedAuctions} = this.props.store

        log.debug(`Deck sort select ${forSaleOrTrade} ${forAuction} ${completedAuctions}`)
        if (forSaleOrTrade && !forAuction) {
            options = forSaleDeckSortOptions
        } else if (completedAuctions) {
            options = completedAuctionDeckSortOptions
        } else if (forAuction) {
            options = forAuctionDeckSortOptions
        }
        return (<KeySelect name={"Sort By"} options={options.map(option => option.name)} selected={this.props.store}/>)
    }
}

export class DeckSortSelectStore implements SelectedStore {

    @observable
    selectedValue: string

    @observable
    forSaleOrTrade: boolean

    @observable
    forAuction: boolean

    @observable
    completedAuctions: boolean

    constructor(forSaleOrTrade: boolean, forAuctionOnly: boolean, completedAuctions: boolean, initialSort?: string) {
        if (initialSort) {
            this.selectedValue = allDeckSortOptions.filter(option => option.value === initialSort)[0].name
        } else {
            this.selectedValue = defaultSort.name
        }
        log.info(`Deck stot store ${forSaleOrTrade} ${forAuctionOnly} ${completedAuctions}`)
        this.forSaleOrTrade = forSaleOrTrade
        this.forAuction = forAuctionOnly
        this.completedAuctions = completedAuctions
    }

    toEnumValue = () => {
        if (!this.selectedValue) {
            return defaultSort.value
        }
        return allDeckSortOptions.filter(option => option.name === this.selectedValue)[0].value
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
    recentlyListed: "RECENTLY_LISTED",
    endingSoonest: "ENDING_SOONEST",
    addedDate: "ADDED_DATE",
    cardsRating: "CARDS_RATING",
    name: "NAME",
    completedRecently: "COMPLETED_RECENTLY"
}

const deckSortOptions: SortOption[] = [
    {value: DeckSorts.addedDate, name: "Date Added"},
    {value: DeckSorts.sas, name: "SAS Rating"},
    {value: DeckSorts.cardsRating, name: "Card Rating"},
    {value: DeckSorts.aerc, name: "AERC Score"},
    {value: DeckSorts.chains, name: "Chains"},
    {value: DeckSorts.funniest, name: "Funniest"},
    {value: DeckSorts.wishlisted, name: "Most Wishlisted"},
    {value: DeckSorts.name, name: "Name"},
]

const forSaleDeckSortOptions: SortOption[] = deckSortOptions.slice()
forSaleDeckSortOptions.unshift({value: DeckSorts.recentlyListed, name: "Recently Listed"})

const forAuctionDeckSortOptions: SortOption[] = deckSortOptions.slice()
forAuctionDeckSortOptions.unshift({value: DeckSorts.recentlyListed, name: "Recently Listed"})
forAuctionDeckSortOptions.unshift({value: DeckSorts.endingSoonest, name: "Ending Soonest"})

const completedAuctionDeckSortOptions: SortOption[] = deckSortOptions.slice()
completedAuctionDeckSortOptions.unshift({value: DeckSorts.completedRecently, name: "Completed Recently"})

const allDeckSortOptions: SortOption[] = deckSortOptions.slice()
allDeckSortOptions.unshift({value: DeckSorts.completedRecently, name: "Completed Recently"})
allDeckSortOptions.unshift({value: DeckSorts.endingSoonest, name: "Ending Soonest"})
allDeckSortOptions.unshift({value: DeckSorts.recentlyListed, name: "Recently Listed"})

export const defaultSort = deckSortOptions[1]
