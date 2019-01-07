import { Chip, MenuItem, Paper, TextField, Typography } from "@material-ui/core"
import CancelIcon from "@material-ui/icons/Cancel"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import Select from "react-select"
import { ValueType } from "react-select/lib/types"
import { spacing } from "../config/MuiConfig"
import { CardStore } from "./CardStore"
import { KCard } from "./KCard"

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

export interface CardSuggestOption {
    label: string
    value: KCard
}

interface CardSearchSuggestProps {
    style?: React.CSSProperties
    updateCardName: (cardName: string) => void
}

@observer
export class CardSearchSuggest extends React.Component<CardSearchSuggestProps> {

    @observable
    selectedCard?: CardSuggestOption

    render() {
        return (
            <div
                style={{
                    width: 240,
                    ...this.props.style
                }}
            >
                <Select
                    options={CardStore.instance.cardSuggestions}
                    components={components}
                    value={this.selectedCard}
                    onChange={(value: ValueType<{ label: string, value: KCard }>) => {
                        this.selectedCard = value as CardSuggestOption
                        if (this.selectedCard) {
                            this.props.updateCardName(this.selectedCard.value.cardTitle)
                        } else {
                            this.props.updateCardName("")
                        }
                    }}
                    placeholder="Deck must contain card"
                    isClearable
                />
            </div>
        )
    }
}