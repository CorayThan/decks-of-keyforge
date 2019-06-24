import { MenuItem, Paper, TextField, Typography } from "@material-ui/core"
import { BaseTextFieldProps } from "@material-ui/core/TextField"
import * as React from "react"
import { HTMLAttributes } from "react"
import { ValueContainerProps } from "react-select/lib/components/containers"
import { ControlProps } from "react-select/lib/components/Control"
import { MenuProps, NoticeProps } from "react-select/lib/components/Menu"
import { OptionProps } from "react-select/lib/components/Option"
import { PlaceholderProps } from "react-select/lib/components/Placeholder"
import { SingleValueProps } from "react-select/lib/components/SingleValue"
import { spacing } from "../config/MuiConfig"
import { DeckCardQuantity } from "../decks/search/DeckFilters"
import { screenStore } from "../ui/ScreenStore"

interface OptionType {
    label: string
    value: string
}

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> & HTMLAttributes<HTMLDivElement>

const inputComponent = (props: InputComponentProps) => {
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

const Control = (props: ControlProps<OptionType>) => (
    <TextField
        fullWidth={true}
        style={{
            display: "flex",
            padding: 0,
            height: "auto",
        }}
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

const Option = (props: OptionProps<OptionType>) => (
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

const Placeholder = (props: PlaceholderProps<OptionType>) => {
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

const SingleValue = (props: SingleValueProps<OptionType>) => (
    <Typography
        style={{fontSize: 16}}
        noWrap={true}
        {...props.innerProps}
    >
        {props.children}
    </Typography>
)

const ValueContainer = (props: ValueContainerProps<OptionType>) => {
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

const Menu = (props: MenuProps<OptionType>) => (
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

const NoOptionsMessage = (props: NoticeProps<OptionType>) => (
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
//
// @observer
// export class CardSearchSuggest extends React.Component<CardSearchSuggestProps> {
//
//     render() {
//         const card = this.props.card
//         return (
//             <div
//                 style={{
//                     width: 192,
//                     ...this.props.style
//                 }}
//             >
//                 <Select
//                     options={cardStore.cardNames}
//                     components={components}
//                     value={card.cardName ? {label: card.cardName, value: card.cardName} : null}
//                     onChange={(value: ValueType<{ label: string, value: string }>) => {
//                         if (value == null) {
//                             card.cardName = ""
//                         } else {
//                             const valueNonArray = value as { label: string, value: string }
//                             card.cardName = valueNonArray!.value
//                         }
//                     }}
//                     placeholder={this.props.placeholder ? this.props.placeholder : "Filter on card"}
//                     isClearable={true}
//                 />
//             </div>
//         )
//     }
// }