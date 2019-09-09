import { Tooltip, Typography } from "@material-ui/core"
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

export const CardAercInfoDisplay = (props: { value: InfoIconValue }) => {
    return (
        <Tooltip title={props.value.tooltip}>
            <div style={{display: "flex", alignItems: "center"}}>
                <Typography variant={"h6"} style={{marginRight: spacing(1)}}>{props.value.info}</Typography>
                {props.value.icon}
            </div>
        </Tooltip>
    )
}


const InfoIcon = (props: { value: InfoIconValue, small?: boolean, style?: React.CSSProperties }) => {
    let value = props.value.info
    if (typeof value === "number") {
        value = value.toFixed(value < 10 && value % 1 !== 0 ? 1 : 0)
    }
    return (
        <Tooltip title={props.value.tooltip}>
            <div style={{display: "flex", alignItems: "center", ...props.style}}>
                <Typography variant={props.small ? "body1" : "h6"} style={{marginRight: spacing(1), width: 24, textAlign: "right"}}>
                    {value}
                </Typography>
                <div style={{display: "flex", width: props.small ? 20 : 24}}>
                    {props.value.icon}
                </div>
            </div>
        </Tooltip>
    )
}
