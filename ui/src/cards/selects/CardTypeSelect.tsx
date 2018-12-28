import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Utils } from "../../config/Utils"
import { MultiSelect, SelectedValues } from "../../mui-restyled/MultiSelect"
import { CardType } from "../CardType"

const cardTypeSelectValues = Utils.enumValues(CardType) as CardType[]

@observer
export class CardTypeSelect extends React.Component<{ selectedCardTypes: SelectedCardTypes }> {

    render() {
        const selectedCardTypes = this.props.selectedCardTypes
        return (
            <MultiSelect name={"Card Type"} options={cardTypeSelectValues} selected={selectedCardTypes}/>
        )
    }
}

export class SelectedCardTypes implements SelectedValues<CardType> {
    selectedValues: IObservableArray<CardType> = observable([])
}
