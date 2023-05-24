import {makeObservable, observable} from "mobx"
import {observer} from "mobx-react"
import * as React from "react"
import {KeySelect, SelectedStore} from "../mui-restyled/KeySelect";
import {AllianceDeckSortOptions} from "../generated-src/AllianceDeckSortOptions";

@observer
export class AllianceDeckSortSelect extends React.Component<{ store: AllianceDeckSortSelectStore }> {
    render() {
        return (<KeySelect name={"Sort By"} options={deckSortOptions.map(option => option.name)} selected={this.props.store}/>)
    }
}

export class AllianceDeckSortSelectStore implements SelectedStore {

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

export interface SortOption {
    name: string
    value: AllianceDeckSortOptions
}

const deckSortOptions: SortOption[] = [
    {value: AllianceDeckSortOptions.SAS_RATING, name: "SAS Rating"},
    {value: AllianceDeckSortOptions.ADDED_DATE, name: "Date Added"},
    {value: AllianceDeckSortOptions.NAME, name: "Name"},
]

export const defaultSort = deckSortOptions[0]
