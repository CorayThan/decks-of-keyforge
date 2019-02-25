import { observable } from "mobx"
import * as React from "react"
import { SortOption } from "../../decks/selects/DeckSortSelect"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

export class CardSortSelect extends React.Component<{store: CardSortSelectStore}> {
    render() {
        return (<KeySelect name={"Sort By"} options={cardSortOptions.map(option => option.name)} selected={this.props.store}/>)
    }
}

export class CardSortSelectStore implements SelectedStore {

    @observable
    selectedValue = cardSortOptions[0].name

    toEnumValue = () => {
        if (!this.selectedValue) {
            return cardSortOptions[0].value
        }
        return cardSortOptions.filter(option => option.name === this.selectedValue)[0].value
    }
}

const cardSortOptions: SortOption[] = [
    {value: "SET_NUMBER", name: "Set Number"},
    {value: "CARD_RATING", name: "Card Rating"},
    {value: "WIN_RATE", name: "Win Rate"},
    {value: "EXPECTED_AMBER", name: "Expected Aember"},
    {value: "AMBER_CONTROL", name: "Aember Control"},
    {value: "CREATURE_CONTROL", name: "Creature Control"},
    {value: "ARTIFACT_CONTROL", name: "Artifact Control"},
]
