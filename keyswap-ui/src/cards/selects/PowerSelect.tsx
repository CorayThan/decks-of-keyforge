import { range } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { MultiSelect, SelectedValues } from "../../mui-restyled/MultiSelect"

const powerOptions = range(1, 13)
    .map(power => power.toString())

@observer
export class PowerSelect extends React.Component<{ selectedPowers: SelectedPowers }> {

    render() {
        const selectedPowers = this.props.selectedPowers
        return (
            <MultiSelect name={"Power"} options={powerOptions} selected={selectedPowers}/>
        )
    }
}

export class SelectedPowers implements SelectedValues<string> {
    selectedValues: IObservableArray<string> = observable([])

    toArray = (): number[] => this.selectedValues.map(power => Number(power))
}
