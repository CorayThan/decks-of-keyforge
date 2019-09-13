import { Tooltip, Typography } from "@material-ui/core"
import { TypographyClassKey } from "@material-ui/core/Typography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export interface InfoIconValue {
    info: number | string
    icon: React.ReactNode
    tooltip: React.ReactNode
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
    let value = props.value.info
    if (typeof value === "number") {
        value = value.toFixed(value < 10 && value % 1 !== 0 ? 1 : 0)
    }

    let variant: TypographyClassKey
    let iconSize = 24
    if (props.small) {
        variant = "body1"
        iconSize = 20
    } else {
        variant = "h6"
    }
    return (
        <Tooltip title={props.value.tooltip}>
            <div style={{display: "flex", alignItems: "center", ...props.style}}>
                <Typography variant={variant} style={{marginRight: spacing(1), width: 32, textAlign: "right"}}>
                    {value}
                </Typography>
                <div style={{display: "flex", width: iconSize}}>
                    {props.value.icon}
                </div>
            </div>
        </Tooltip>
    )
}
