import { range } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { MultiSelect, SelectedValues } from "../../mui-restyled/MultiSelect"

const amberOptions = range(0, 5)
    .map(amber => amber.toString())

@observer
export class AmberSelect extends React.Component<{ selectedAmbers: SelectedAmbers }> {

    render() {
        const selectedAmbers = this.props.selectedAmbers
        return (
            <MultiSelect name={"Aember"} options={amberOptions} selected={selectedAmbers}/>
        )
    }
}

export class SelectedAmbers implements SelectedValues<string> {
    selectedValues: IObservableArray<string> = observable([])

    toArray = (): number[] => this.selectedValues.map(amber => Number(amber))
}
