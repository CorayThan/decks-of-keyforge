import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@material-ui/core"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { log } from "../config/Utils"
import { KeyMultiSelectProps, SelectedValue } from "./KeyMultiSelect"

@observer
export class KeyMultiCheckbox<T> extends React.Component<KeyMultiSelectProps<T>> {

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const option = event.target.name as unknown as T
        const chosen = event.target.checked
        log.info("option: " + option + " " + chosen)
        if (chosen) {
            this.props.selected.selectedValues.push(option)
        } else {
            this.props.selected.selectedValues = this.props.selected.selectedValues.filter(alreadySelected => alreadySelected !== option)
        }
    }

    render() {
        const {selected, options, name} = this.props
        const selectedValues = selected.selectedValues

        const optionsFixed = (options.length > 0 && typeof options[0] === "string"
            ? ((options as string[]).map(option => ({value: option, label: startCase(option)})))
            : options) as SelectedValue<T>[]

        return (
            <FormControl>
                <FormLabel component={"legend"}>{name}</FormLabel>
                <FormGroup>
                    {optionsFixed.map(option => {
                        return (
                            <FormControlLabel
                                key={option.label}
                                control={(
                                    <Checkbox
                                        checked={selectedValues.indexOf(option.value) > -1}
                                        onChange={this.handleChange}
                                        name={option.value as unknown as string}
                                    />
                                )}
                                label={option.label}
                            />
                        )
                    })}
                </FormGroup>
            </FormControl>
        )
    }
}
