import { makeObservable, observable } from "mobx"
import * as React from "react"
import { SortOption } from "../../decks/selects/DeckSortSelect"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

const cardSortOptions: SortOption[] = [
    {value: "SET_NUMBER", name: "Set Number"},
    {value: "AERC", name: "Total Aerc"},
    {value: "RELATIVE_WIN_RATE", name: "Relative Win Rate"},
    {value: "WIN_RATE", name: "Win Rate"},
    {value: "NAME", name: "Card Name"},
    {value: "EXPECTED_AMBER", name: "Expected Aember"},
    {value: "AMBER_CONTROL", name: "Aember Control"},
    {value: "CREATURE_CONTROL", name: "Creature Control"},
    {value: "ARTIFACT_CONTROL", name: "Artifact Control"},
]

export class CardSortSelect extends React.Component<{store: CardSortSelectStore}> {
    render() {
        return (<KeySelect name={"Sort By"} options={cardSortOptions.map(option => option.name)} selected={this.props.store}/>)
    }
}

export class CardSortSelectStore implements SelectedStore {

    @observable
    selectedValue = cardSortOptions[0].name

    constructor(initial?: string) {
        makeObservable(this)
        if (initial != null) {
            this.selectedValue = cardSortOptions.find(option => option.value === initial)?.name ?? cardSortOptions[0].name
        }
    }

    toEnumValue = () => {
        if (!this.selectedValue) {
            return cardSortOptions[0].value
        }
        return cardSortOptions.filter(option => option.name === this.selectedValue)[0].value
    }
}
