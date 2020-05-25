import { Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { TypographyClassKey } from "@material-ui/core/Typography"
import * as React from "react"
import { AercForCombos, AercForCombosProps } from "../aerc/AercForCombos"
import { CardsMatchSasTip, CardsMatchSasTipProps } from "../aerc/CardsMatchSasTip"
import { spacing } from "../config/MuiConfig"

const useStyles = makeStyles({
    root: (props: { small?: boolean }) => ({
        display: "flex",
        alignItems: "center",
        marginBottom: props.small ? spacing(0.25) : spacing(0.5),
        marginLeft: spacing(1)
    }),
    text: {
        marginRight: spacing(1),
        width: 32,
        textAlign: "right"
    },
    icon: (props: { small?: boolean }) => ({
        display: "flex",
        width: props.small ? 20 : 24
    })
})

export interface InfoIconValue {
    info: number | string
    icon: React.ReactNode
    combosTips?: Omit<AercForCombosProps, "children">
    cardsTips?: Omit<CardsMatchSasTipProps, "children">
}

export const InfoIconList = (props: { values: InfoIconValue[], small?: boolean }) => {
    const {values, small} = props
    return (
        <div>
            {values.map((value, idx) => {
                return (
                    <InfoIcon
                        value={value}
                        key={idx}
                        small={small}
                    />
                )
            })}
        </div>
    )
}

const InfoIcon = (props: { value: InfoIconValue, small?: boolean }) => {
    const classes = useStyles(props)
    const {value, small} = props
    const {info, combosTips, cardsTips} = value
    let displayValue = info
    if (typeof displayValue === "number") {
        displayValue = displayValue.toFixed(displayValue < 10 && displayValue % 1 !== 0 ? 1 : 0)
    }

    let variant: TypographyClassKey
    if (small) {
        variant = "body1"
    } else {
        variant = "h6"
    }

    const content = (
        <div className={classes.root}>
            <Typography
                variant={variant}
                className={classes.text}
            >
                {displayValue}
            </Typography>
            <div className={classes.icon}>
                {props.value.icon}
            </div>
        </div>
    )
    if (combosTips != null) {
        return (
            <AercForCombos {...combosTips}>
                {content}
            </AercForCombos>
        )
    } else if (cardsTips != null) {
        return (
            <CardsMatchSasTip {...cardsTips}>
                {content}
            </CardsMatchSasTip>
        )
    } else {
        return content
    }
}
