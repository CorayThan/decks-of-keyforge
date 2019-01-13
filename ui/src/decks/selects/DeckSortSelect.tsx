import { observable } from "mobx"
import * as React from "react"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

export class DeckSortSelect extends React.Component<{ store: DeckSortSelectStore }> {
    render() {
        return (<KeySelect name={"Sort By"} options={deckSortOptions.map(option => option.name)} selected={this.props.store}/>)
    }
}

export class DeckSortSelectStore implements SelectedStore {

    @observable
    selectedValue: string

    constructor(initialSort?: string) {
        if (initialSort) {
            this.selectedValue = deckSortOptions.filter(option => option.value === initialSort)[0].name
        } else {
            this.selectedValue = deckSortOptions[0].name
        }

    }

    toEnumValue = () => {
        if (!this.selectedValue) {
            return deckSortOptions[0].value
        }
        return deckSortOptions.filter(option => option.name === this.selectedValue)[0].value
    }
}

export interface SortOption {
    name: string
    value: string
}

const deckSortOptions: SortOption[] = [
    {value: "ADDED_DATE", name: "Date Added"},
    {value: "SAS_RATING", name: "SAS Rating"},
    {value: "CARDS_RATING", name: "Card Rating"},
    {value: "SYNERGY", name: "Synergy"},
    {value: "ANTISYNERGY", name: "Antisynergy"},
    {value: "EXPECTED_AMBER", name: "Expected Amber"},
    {value: "FUNNIEST", name: "Funniest"},
    {value: "MOST_WISHLISTED", name: "Most Wishlisted"},
    {value: "TOTAL_CREATURE_POWER", name: "Total Creature Power"},
    {value: "CREATURE_COUNT", name: "Creature Count"},
    {value: "MAVERICK_COUNT", name: "Maverick Count"},
    {value: "RARES", name: "Rares"},
    {value: "SPECIALS", name: "Special Rarities"}
]
