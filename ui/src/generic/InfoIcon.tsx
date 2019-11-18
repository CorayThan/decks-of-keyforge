import { Typography } from "@material-ui/core"
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
}

export const InfoIconList = (props: { values: InfoIconValue[], horizontal?: boolean, small?: boolean, style?: React.CSSProperties }) => {
    const {values, horizontal, style, small} = props
    return (
        <div style={{display: horizontal ? "flex" : undefined, ...style}}>
            {values.map((value, idx) => {
                return (
                    <InfoIcon value={value} key={idx} style={{marginBottom: small ? spacing(0.25) : spacing(0.5), marginLeft: spacing(1)}} small={small}/>
                )
            })}
        </div>
    )
}

export const InfoIcon = (props: { value: InfoIconValue, small?: boolean, style?: React.CSSProperties }) => {
    const {value} = props
    const {info, combosTips, cardsTips} = value
    let displayValue = info
    if (typeof displayValue === "number") {
        displayValue = displayValue.toFixed(displayValue < 10 && displayValue % 1 !== 0 ? 1 : 0)
    }

    let variant: TypographyClassKey
    let iconSize = 24
    if (props.small) {
        variant = "body1"
        iconSize = 20
    } else {
        variant = "h6"
    }

    const content = (
        <div style={{display: "flex", alignItems: "center", ...props.style}}>
            <Typography variant={variant} style={{marginRight: spacing(1), width: 32, textAlign: "right"}}>
                {displayValue}
            </Typography>
            <div style={{display: "flex", width: iconSize}}>
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
