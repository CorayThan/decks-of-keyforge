import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControl from "@material-ui/core/FormControl/FormControl"
import Input from "@material-ui/core/Input/Input"
import InputLabel from "@material-ui/core/InputLabel/InputLabel"
import ListItemText from "@material-ui/core/ListItemText/ListItemText"
import MenuItem from "@material-ui/core/MenuItem/MenuItem"
import Select from "@material-ui/core/Select/Select"
import { IObservableArray } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { log } from "../config/Utils"

export interface SelectedValues<T extends string> {
    selectedValues: IObservableArray<T>
    reset: () => void
}

export interface MultiSelectOption {
    value: string
    option: React.ReactNode
}

interface MultiSelectProps {
    name: string
    selected: SelectedValues<string>
    options: string[] | MultiSelectOption[]
}

@observer
export class MultiSelect extends React.Component<MultiSelectProps> {

    handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        log.debug(`target value: ${event.target.value}`)
        this.props.selected.selectedValues.replace(event.target.value as unknown as string[])
    }

    render() {
        const {selected, options, name} = this.props
        const selectedRarities = selected.selectedValues
        const fixedOptions =
            typeof options[0] === "string" ? (options as string[]).map(option => ({value: option, option})) : options as MultiSelectOption[]

        const id = `select-multiple-${options.join("")}`

        return (
            <div style={{display: "flex", flexWrap: "wrap"}}>
                <FormControl style={{minWidth: 120, maxWidth: 300}}>
                    <InputLabel htmlFor={id}>{name}</InputLabel>
                    <Select
                        multiple={true}
                        value={selectedRarities}
                        onChange={this.handleChange}
                        input={<Input id={id}/>}
                        // tslint:disable-next-line
                        renderValue={(selectedValue: any) => selectedValue.join(", ")}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 48 * 4.5 + 8,
                                    width: 250
                                }
                            }
                        }}
                    >
                        {fixedOptions.map(option => {
                            return (
                                <MenuItem key={option.value} value={option.value}>
                                    <Checkbox checked={selectedRarities.indexOf(option.value) > -1}/>
                                    <ListItemText primary={option.option}/>
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </div>
        )
    }
}