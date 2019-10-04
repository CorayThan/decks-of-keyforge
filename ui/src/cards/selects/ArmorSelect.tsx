import { range } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { MultiSelect, SelectedValues } from "../../mui-restyled/MultiSelect"

const armorOptions = range(0, 6)
    .map(armor => armor.toString())

@observer
export class ArmorSelect extends React.Component<{ selectedArmors: SelectedArmors }> {

    render() {
        const selectedArmors = this.props.selectedArmors
        return (
            <MultiSelect name={"Armor"} options={armorOptions} selected={selectedArmors}/>
        )
    }
}

export class SelectedArmors implements SelectedValues<string> {
    selectedValues: IObservableArray<string> = observable([])

    reset = () => this.selectedValues.clear()

    toArray = (): number[] => this.selectedValues.map(armor => Number(armor))
}
