import { Tooltip, Typography } from "@material-ui/core"
import { TypographyClassKey } from "@material-ui/core/Typography"
import * as React from "react"
import { AercForCombos, AercForCombosProps } from "../aerc/AercForCombos"
import { CardsMatchSasTip, CardsMatchSasTipProps } from "../aerc/CardsMatchSasTip"
import { spacing } from "../config/MuiConfig"

export interface InfoIconValue {
    info: number | string
    icon: React.ReactNode
    combosTips?: Omit<AercForCombosProps, "children">
    cardsTips?: Omit<CardsMatchSasTipProps, "children">
    basicTip?: string
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
    const {value, small} = props
    const {info, combosTips, cardsTips, basicTip} = value
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
        <div
            style={{
                display: "flex",
                alignItems: "center",
                marginBottom: props.small ? spacing(0.25) : spacing(0.5),
                marginLeft: spacing(1)
            }}
        >
            <Typography
                variant={variant}
                style={{
                    marginRight: spacing(1),
                    width: 32,
                    textAlign: "right"
                }}
            >
                {displayValue}
            </Typography>
            <div
                style={{
                    display: "flex",
                    width: props.small ? 20 : 24
                }}
            >
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
    } else if (basicTip) {
        return (
            <Tooltip title={basicTip} >
                {content}
            </Tooltip>
        )
    } else {
        return content
    }
}
