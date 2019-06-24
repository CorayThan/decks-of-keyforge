import { TextField } from "@material-ui/core"
import MenuItem from "@material-ui/core/MenuItem/MenuItem"
import { observer } from "mobx-react"
import * as React from "react"

interface KeySelectProps {
    name: string
    options: string[]
    selected: SelectedStore
}

export interface SelectedStore {
    selectedValue: string
}

@observer
export class KeySelect extends React.Component<KeySelectProps> {

    handleChange = (event: React.ChangeEvent<{ value: unknown }>) => this.props.selected.selectedValue = event.target.value as string

    render() {
        const {name, options, selected} = this.props
        const id = `key-select-${name}`
        return (
            <TextField
                select={true}
                label={name}
                value={selected.selectedValue}
                onChange={this.handleChange}
                style={{minWidth: 120}}
            >
                {options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
        )
    }
}
