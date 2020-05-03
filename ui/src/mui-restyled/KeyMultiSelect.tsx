import { Checkbox, FormControl, Input, InputLabel, ListItemText, MenuItem, Select } from "@material-ui/core"
import { startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"

export interface SelectedValue<T> {
    value: T
    label: string
}

export class SelectedValues<T> {

    @observable
    selectedValues: T[] = []

    constructor(initial?: T[]) {
        if (initial != null) {
            this.selectedValues = initial
        }
    }

    reset = () => this.selectedValues = []
}

interface KeyMultiSelectProps<T> {
    name: string
    selected: SelectedValues<T>
    options: SelectedValue<T>[] | string[]
}

@observer
export class KeyMultiSelect<T> extends React.Component<KeyMultiSelectProps<T>> {

    handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        this.props.selected.selectedValues = event.target.value as T[]
    }

    render() {
        const {selected, options, name} = this.props
        const selectedValues = selected.selectedValues
        const id = `select-multiple-${options.join("")}`
        const labelId = `${id}-label`

        const optionsFixed = (options.length > 0 && typeof options[0] === "string"
            ? ((options as string[]).map(option => ({value: option, label: startCase(option)})))
            : options) as SelectedValue<T>[]

        return (
            <div style={{display: "flex", flexWrap: "wrap"}}>
                <FormControl style={{minWidth: 120, maxWidth: 300}}>
                    <InputLabel shrink={selectedValues.length !== 0} id={labelId}>{name}</InputLabel>
                    <Select
                        id={id}
                        labelId={labelId}
                        multiple={true}
                        value={selectedValues}
                        onChange={this.handleChange}
                        input={<Input/>}
                        renderValue={(selected) => (selected as string[]).join(", ")}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 48 * 4.5 + 8,
                                    width: 250
                                }
                            }
                        }}
                    >
                        {optionsFixed.map(option => {
                            return (
                                <MenuItem key={option.label} value={option.value as unknown as string | number}>
                                    <Checkbox checked={selectedValues.indexOf(option.value) > -1}/>
                                    <ListItemText primary={option.label}/>
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </div>
        )
    }
}
