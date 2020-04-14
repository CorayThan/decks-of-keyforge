import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import * as React from "react"
import { ExcludedCheckboxIcon } from "../generic/icons/ExcludedCheckboxIcon"

export enum CheckboxState {
    OFF,
    ON,
    EXCLUDED
}

export interface CheckboxThreeStateProps {
    onChange: (state: CheckboxState) => void
    value: CheckboxState
}

export const CheckboxThreeState = (props: CheckboxThreeStateProps) => {
    return (
        <Checkbox
            checked={props.value !== CheckboxState.OFF}
            onChange={() => {
                const previousState = props.value
                let nextState = CheckboxState.OFF
                switch (previousState) {
                    case CheckboxState.ON:
                        nextState = CheckboxState.EXCLUDED
                        break
                    case CheckboxState.EXCLUDED:
                        nextState = CheckboxState.OFF
                        break
                    case CheckboxState.OFF:
                        nextState = CheckboxState.ON
                        break
                    default:
                        throw new Error("No checkbox state option: " + previousState)
                }
                props.onChange(nextState)
            }}
            checkedIcon={props.value === CheckboxState.EXCLUDED ? <ExcludedCheckboxIcon/> : undefined}
        />
    )
}
