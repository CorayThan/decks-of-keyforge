import { observable } from "mobx"
import * as React from "react"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

const deckSortOptions = [
    "Date Added",
    "Deck Name",
    "Aember",
    "Power",
    "Multiples",
    "Maverick Count",
    "Rares",
    "Uncommons"
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
            case "Date Added":
                return "ADDED_DATE"
            case "Aember":
                return "AMBER"
            case "Power":
                return "POWER"
            case "Multiples":
                return "MULTIPLES"
            case "Mavericks":
                return "MAVERICK_COUNT"
            case "Rares":
                return "RARES"
            default:
                return "UNCOMMONS"
        }
    }
}
