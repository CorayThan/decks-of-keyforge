import { useTheme } from "@material-ui/core/styles"
import { observer } from "mobx-react"
import React, { CSSProperties } from "react"
import Select from "react-select"
import { ValueType } from "react-select/lib/types"
import { log, prettyJson } from "../config/Utils"
import { OptionType, searchSuggestComponents, useSearchSuggestStyles } from "./KeyMultiSearchSuggest"


export interface SingleOption {
    option: string
}

interface KeySingleSearchSuggestProps {
    style?: React.CSSProperties
    selected: SingleOption
    placeholder: string
    options: OptionType[]
    fullWidth?: boolean
}

export const KeySingleSearchSuggest = observer((props: KeySingleSearchSuggestProps) => {
    const classes = useSearchSuggestStyles()
    const theme = useTheme()
    const {options, selected, placeholder, style, fullWidth} = props

    function handleSingleChange(value: ValueType<OptionType>) {
        log.debug(`Handle change single value: ${prettyJson(value)}`)
        if (value == null) {
            selected.option = ""
        } else {
            const valueAsOptionType = value as OptionType
            selected.option = valueAsOptionType.value
        }
    }

    const selectStyles = {
        input: (base: CSSProperties) => ({
            ...base,
            "color": theme.palette.text.primary,
            "& input": {
                font: "inherit",
            },
        }),
    }

    return (
        <div className={classes.root}>
            <Select
                classes={classes}
                styles={{...selectStyles, ...style}}
                options={options}
                components={searchSuggestComponents}
                value={selected.option ? {label: options.find(option => option.value === selected.option)!.label, value: selected.option} : null}
                onChange={handleSingleChange}
                isMulti={false}
                placeholder={placeholder}
                autoFocus={true}
                fullWidth={fullWidth}
            />
        </div>
    )
})
