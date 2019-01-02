import { observable } from "mobx"
import * as React from "react"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"
import { deckSortOptions } from "../DeckFilters"

export class DeckSortSelect extends React.Component<{ store: DeckSortSelectStore }> {
    render() {
        return (<KeySelect name={"Sort By"} options={deckSortOptions.map(option => option.name)} selected={this.props.store}/>)
    }
}

export class DeckSortSelectStore implements SelectedStore {

    @observable
    selectedValue = ""

    toEnumValue = () => {
        if (!this.selectedValue) {
            return deckSortOptions[0].value
        }
        const value = deckSortOptions.filter(option => option.name === this.selectedValue)[0].value
        // if (value == null) {
        //     return deckSortOptions[0].value
        // }
        return value
    }
}
