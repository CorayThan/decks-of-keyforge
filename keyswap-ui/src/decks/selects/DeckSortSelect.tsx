import { observable } from "mobx"
import * as React from "react"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

const dateAdded = "Date Added"
const deckName = "Deck Name"
const amber = "Expected Amber"
const power = "Total Power"
const mavericks = "Maverick Count"
const rares = "Rares"
const uncommons = "Uncommons"
const specials = "Specials"

const deckSortOptions = [
    dateAdded,
    deckName,
    amber,
    power,
    mavericks,
    rares,
    uncommons,
    specials
]

export class DeckSortSelect extends React.Component<{store: DeckSortSelectStore}> {
    render() {
        return (<KeySelect name={"Sort By"} options={deckSortOptions} selected={this.props.store}/>)
    }
}

export class DeckSortSelectStore implements SelectedStore {

    @observable
    selectedValue = ""

    toEnumValue = () => {
        switch (this.selectedValue) {
            case deckName:
                return "DECK_NAME"
            case amber:
                return "AMBER"
            case power:
                return "POWER"
            case mavericks:
                return "MAVERICK_COUNT"
            case rares:
                return "RARES"
            case specials:
                return "SPECIALS"
            case uncommons:
                return "UNCOMMONS"
            default:
                return "ADDED_DATE"
        }
    }
}
