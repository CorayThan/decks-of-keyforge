import FormControl from "@material-ui/core/FormControl/FormControl"
import InputLabel from "@material-ui/core/InputLabel/InputLabel"
import MenuItem from "@material-ui/core/MenuItem/MenuItem"
import Select from "@material-ui/core/Select/Select"
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

    handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => this.props.selected.selectedValue = event.target.value

    render() {
        const {name, options, selected} = this.props
        const id = `key-select-${name}`
        return (
            <FormControl style={{minWidth: 120}}>
                <InputLabel htmlFor={id}>{name}</InputLabel>
                <Select
                    value={selected.selectedValue}
                    onChange={this.handleChange}
                    inputProps={{
                        name,
                        id: `key-select-${name}`
                    }}
                >
                    {options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }
}
