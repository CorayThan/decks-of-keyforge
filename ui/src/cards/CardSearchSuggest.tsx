import { Chip, MenuItem, Paper, TextField, Typography } from "@material-ui/core"
import CancelIcon from "@material-ui/icons/Cancel"
import { observer } from "mobx-react"
import * as React from "react"
import Select from "react-select"
import { ValueType } from "react-select/lib/types"
import { spacing } from "../config/MuiConfig"
import { DeckCardQuantity } from "../decks/search/DeckFilters"
import { CardStore } from "./CardStore"

const inputComponent = (props: any) => {
    const {inputRef, ...rest} = props
    return (
        <div
            style={{
                display: "flex",
                padding: 0,
            }}
            ref={inputRef}
            {...rest}
        />
    )
}

const Control = (props: any) => (
    <TextField
        fullWidth
        InputProps={{
            inputComponent,
            inputProps: {
                inputRef: props.innerRef,
                children: props.children,
                ...props.innerProps,
            },
        }}
        {...props.selectProps.textFieldProps}
    />
)

const Option = (props: any) => (
    <MenuItem
        buttonRef={props.innerRef}
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

const Placeholder = (props: any) => (
    <Typography
        color="textSecondary"
        style={{
            position: "absolute",
            left: 2,
            fontSize: 16,
        }}
        {...props.innerProps}
    >
        {props.children}
    </Typography>
)

const SingleValue = (props: any) => (
    <Typography
        style={{fontSize: 16}}
        {...props.innerProps}
    >
        {props.children}
    </Typography>
)

const ValueContainer = (props: any) => (
    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            flex: 1,
            alignItems: "center",
            overflow: "hidden",
        }}
    >
        {props.children}
    </div>
)

const MultiValue = (props: any) => (
    <Chip
        tabIndex={-1}
        label={props.children}
        onDelete={props.removeProps.onClick}
        deleteIcon={<CancelIcon {...props.removeProps} />}
    />
)

const Menu = (props: any) => (
    <Paper
        square={true}
        style={{
            position: "absolute",
            zIndex: 1,
            marginTop: spacing(1),
            left: 0,
            right: 0,
        }}
        {...props.innerProps}
    >
        {props.children}
    </Paper>
)

const NoOptionsMessage = (props: any) => (
    <Typography
        color="textSecondary"
        style={{padding: `${spacing(1)}px ${spacing(2)}px`}}
        {...props.innerProps}
    >
        {props.children}
    </Typography>
)

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
}

interface CardSearchSuggestProps {
    style?: React.CSSProperties
    card: DeckCardQuantity
}

@observer
export class CardSearchSuggest extends React.Component<CardSearchSuggestProps> {

    render() {
        return (
            <div
                style={{
                    width: 240,
                    ...this.props.style
                }}
            >
                <Select
                    options={CardStore.instance.cardNames}
                    components={components}
                    value={{label: this.props.card.cardName, value: this.props.card.cardName}}
                    onChange={(value: ValueType<{ label: string, value: string }>) => {
                        const valueNonArray = value as { value: string }
                        this.props.card.cardName = valueNonArray!.value
                    }}
                    placeholder="Deck must contain card"
                    isClearable
                />
            </div>
        )
    }
}