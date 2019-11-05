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
import { log, prettyJson } from "../config/Utils"
import { DeckCardQuantity } from "../decks/search/DeckFilters"
import { cardStore } from "./CardStore"

export interface OptionType {
    label: string
    value: string
}

const useStyles = makeStyles((theme: Theme) =>
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
            Loading Cards ...
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

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
}

interface MultiCardSearchSuggestProps {
    style?: React.CSSProperties
    card: DeckCardQuantity
    placeholder: string
}

@observer
export class MultiCardSearchSuggest extends React.Component<MultiCardSearchSuggestProps> {
    render() {
        return <MultiCardSearchSuggestInner {...this.props} cards={cardStore.cardNames}/>
    }
}

const MultiCardSearchSuggestInner = observer((props: MultiCardSearchSuggestProps & { cards: OptionType[] }) => {
    const classes = useStyles()
    const theme = useTheme()
    const {card, cards, placeholder, style} = props

    function handleChangeMulti(value: ValueType<OptionType>) {
        if (value == null) {
            card.cardNames = []
        } else {
            const valuesArray = value as OptionType[]
            card.cardNames = valuesArray.map(cardOption => cardOption.value)
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
                    inputId="react-select-multiple"
                    options={cards}
                    components={components}
                    value={card.cardNames ? card.cardNames.map(cardName => ({label: cardName, value: cardName})) : null}
                    onChange={handleChangeMulti}
                    isMulti={true}
                    placeholder={placeholder}
                />
            </NoSsr>
        </div>
    )
})

export interface SingleCardName {
    cardName: string
}

interface SingleCardSearchSuggestProps {
    style?: React.CSSProperties
    card: SingleCardName
    placeholder: string
}

@observer
export class SingleCardSearchSuggest extends React.Component<SingleCardSearchSuggestProps> {
    render() {
        const names = cardStore.cardNames
        log.debug(`Card names length: ${names.length}`)
        return <SingleCardSearchSuggestInner {...this.props} cards={names}/>
    }
}

const SingleCardSearchSuggestInner = observer((props: SingleCardSearchSuggestProps & { cards: OptionType[] }) => {
    const classes = useStyles()
    const theme = useTheme()
    const {card, cards, placeholder, style} = props

    function handleSingleChange(value: ValueType<OptionType>) {
        log.debug(`Handle change single value: ${prettyJson(value)}`)
        if (value == null) {
            card.cardName = ""
        } else {
            const valueAsOptionType = value as OptionType
            card.cardName = valueAsOptionType.value
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
                inputId="react-select-multiple"
                options={cards}
                components={components}
                value={card.cardName ? {label: card.cardName, value: card.cardName} : null}
                onChange={handleSingleChange}
                isMulti={false}
                placeholder={placeholder}
            />
        </div>
    )
})
