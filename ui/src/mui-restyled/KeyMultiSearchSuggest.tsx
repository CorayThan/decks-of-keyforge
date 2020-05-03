/* eslint-disable @typescript-eslint/no-explicit-any */
import Chip from "@material-ui/core/Chip"
import MenuItem from "@material-ui/core/MenuItem"
import NoSsr from "@material-ui/core/NoSsr"
import Paper from "@material-ui/core/Paper"
import { createStyles, emphasize, makeStyles, Theme, useTheme } from "@material-ui/core/styles"
import TextField, { BaseTextFieldProps } from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import CancelIcon from "@material-ui/icons/Cancel"
import clsx from "clsx"
import { observable } from "mobx"
import { observer } from "mobx-react"
import PropTypes from "prop-types"
import React, { CSSProperties, HTMLAttributes } from "react"
import Select from "react-select"
import { ValueContainerProps } from "react-select/lib/components/containers"
import { ControlProps } from "react-select/lib/components/Control"
import { MenuProps, NoticeProps } from "react-select/lib/components/Menu"
import { MultiValueProps } from "react-select/lib/components/MultiValue"
import { OptionProps } from "react-select/lib/components/Option"
import { PlaceholderProps } from "react-select/lib/components/Placeholder"
import { ValueType } from "react-select/lib/types"

export interface OptionType {
    label: string
    value: string
}

export const useSearchSuggestStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        input: {
            display: "flex",
            padding: 0,
            height: "auto",
        },
        valueContainer: {
            display: "flex",
            flexWrap: "wrap",
            flex: 1,
            alignItems: "center",
            overflow: "hidden",
        },
        chip: {
            margin: theme.spacing(0.5, 0.25),
        },
        chipFocused: {
            backgroundColor: emphasize(
                theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                0.08,
            ),
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2),
        },
        singleValue: {
            fontSize: 16,
        },
        placeholder: {
            position: "absolute",
            left: 2,
            bottom: 6,
            fontSize: 16,
        },
        paper: {
            position: "absolute",
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0,
        },
        divider: {
            height: theme.spacing(2),
        },
    }),
)

function NoOptionsMessage(props: NoticeProps<OptionType>) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            Loading ...
        </Typography>
    )
}

NoOptionsMessage.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
} as any

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> & HTMLAttributes<HTMLDivElement>

function inputComponent({inputRef, ...props}: InputComponentProps) {
    // eslint-disable-next-line
    //@ts-ignore
    return <div ref={inputRef} {...props} />
}

inputComponent.propTypes = {
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
} as any

function Control(props: ControlProps<OptionType>) {
    const {
        children,
        innerProps,
        innerRef,
        selectProps: {classes, TextFieldProps},
    } = props

    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: classes.input,
                    ref: innerRef,
                    children,
                    ...innerProps,
                },
            }}
            {...TextFieldProps}
        />
    )
}

Control.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectProps: PropTypes.object.isRequired,
} as any

function Option(props: OptionProps<OptionType>) {
    return (
        // eslint-disable-next-line
        // @ts-ignore
        <MenuItem
            ref={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    )
}

Option.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
} as any

function Placeholder(props: PlaceholderProps<OptionType>) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    )
}

Placeholder.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
} as any

function ValueContainer(props: ValueContainerProps<OptionType>) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
}

ValueContainer.propTypes = {
    children: PropTypes.node,
    selectProps: PropTypes.object.isRequired,
} as any

function MultiValue(props: MultiValueProps<OptionType>) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={clsx(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    )
}

MultiValue.propTypes = {
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    removeProps: PropTypes.object.isRequired,
    selectProps: PropTypes.object.isRequired,
} as any

function Menu(props: MenuProps<OptionType>) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    )
}

Menu.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object,
} as any

export const searchSuggestComponents = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
}

export class SelectedOptions {

    @observable
    selectedValues: string[] = []

    constructor(initial?: string[], private onChange?: (newValues: string[]) => void) {
        if (initial != null) {
            this.selectedValues = initial
        }
    }

    update = (newValues: string[]) => {
        this.selectedValues = newValues
        if (this.onChange) {
            this.onChange(newValues)
        }
    }

    reset = () => this.update([])
}

export interface KeyMultiSearchSuggestProps {
    style?: React.CSSProperties
    selected: SelectedOptions
    placeholder: string
    options: OptionType[]
    fullWidth?: boolean
}

export const KeyMultiSearchSuggest = observer((props: KeyMultiSearchSuggestProps) => {
    const classes = useSearchSuggestStyles()
    const theme = useTheme()
    const {selected, options, placeholder, style, fullWidth} = props

    function handleChangeMulti(value: ValueType<OptionType>) {
        if (value == null) {
            selected.reset()
        } else {
            const valuesArray = value as OptionType[]
            selected.update(valuesArray.map(cardOption => cardOption.value))
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
            <NoSsr>
                <Select
                    classes={classes}
                    styles={{...selectStyles, ...style}}
                    options={options}
                    components={searchSuggestComponents}
                    value={selected.selectedValues?.map(selected => ({label: options.find(option => option.value === selected)!.label, value: selected}))}
                    onChange={handleChangeMulti}
                    isMulti={true}
                    placeholder={placeholder}
                    fullWidth={fullWidth}
                />
            </NoSsr>
        </div>
    )
})
