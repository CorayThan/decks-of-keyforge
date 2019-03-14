import { MenuItem, Paper, TextField, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import Select from "react-select"
import { ValueType } from "react-select/lib/types"
import { spacing } from "../config/MuiConfig"
import { DeckCardQuantity } from "../decks/search/DeckFilters"
import { screenStore } from "../ui/ScreenStore"
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

const Placeholder = (props: any) => {
    return (
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
}

const SingleValue = (props: any) => (
    <Typography
        style={{fontSize: 16}}
        noWrap={true}
        {...props.innerProps}
    >
        {props.children}
    </Typography>
)

const ValueContainer = (props: any) => {
    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            {props.children}
        </div>
    )
}

const Menu = (props: any) => (
    <Paper
        square={true}
        style={{
            position: "absolute",
            zIndex: screenStore.zindexes.cardSearchSuggest,
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
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
}

interface CardSearchSuggestProps {
    style?: React.CSSProperties
    card: DeckCardQuantity
    placeholder?: string
}

@observer
export class CardSearchSuggest extends React.Component<CardSearchSuggestProps> {

    render() {
        const card = this.props.card
        return (
            <div
                style={{
                    width: 192,
                    ...this.props.style
                }}
            >
                <Select
                    options={CardStore.instance.cardNames}
                    components={components}
                    value={card.cardName ? {label: card.cardName, value: card.cardName} : null}
                    onChange={(value: ValueType<{ label: string, value: string }>) => {
                        if (value == null) {
                            card.cardName = ""
                        } else {
                            const valueNonArray = value as { label: string, value: string }
                            card.cardName = valueNonArray!.value
                        }
                    }}
                    placeholder={this.props.placeholder ? this.props.placeholder : "Filter on card"}
                    isClearable
                />
            </div>
        )
    }
}