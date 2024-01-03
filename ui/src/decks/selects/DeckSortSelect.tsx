import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"
import { DeckSortOptions } from "../../generated-src/DeckSortOptions"

@observer
export class DeckSortSelect extends React.Component<{ store: DeckSortSelectStore }> {
    render() {
        return (<KeySelect name={"Sort By"} options={sortOptionsStrings} selected={this.props.store}/>)
    }
}

export class DeckSortSelectStore implements SelectedStore {

    @observable
    selectedValue: string

    constructor(initialSort?: string) {
        makeObservable(this)
        if (initialSort) {
            this.selectedValue = deckSortOptions.filter(option => option.value === initialSort)[0].name
        } else {
            this.selectedValue = defaultSort.name
        }
    }

    toEnumValue = () => {
        if (!this.selectedValue) {
            return defaultSort.value
        }
        return deckSortOptions.filter(option => option.name === this.selectedValue)[0].value
    }
}

export interface DeckSortOption {
    name: string
    value: DeckSortOptions
}

const deckSortOptions: DeckSortOption[] = [
    {value: DeckSortOptions.ADDED_DATE, name: "Date Added"},
    {value: DeckSortOptions.SAS_RATING, name: "SAS Rating"},
]

const sortOptionsStrings = deckSortOptions.map(option => option.name)

export const defaultSort = deckSortOptions[1]
