import { observable } from "mobx"
import * as React from "react"
import { KeySelect, SelectedStore } from "../../mui-restyled/KeySelect"

const cardSortOptions = [
    "Set Number",
    "Card Name",
    "Aember",
    "Power",
    "Armor"
]

export class CardSortSelect extends React.Component<{store: CardSortSelectStore}> {
    render() {
        return (<KeySelect name={"Sort By"} options={cardSortOptions} selected={this.props.store}/>)
    }
}

export class CardSortSelectStore implements SelectedStore {

    @observable
    selectedValue = ""

    toEnumValue = () => {
        switch (this.selectedValue) {
            case "Card Name":
                return "CARD_NAME"
            case "Aember":
                return "AMBER"
            case "Power":
                return "POWER"
            case "Armor":
                return "ARMOR"
            default:
                return "SET_NUMBER"
        }
    }
}
