import { Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export interface InfoIconValue {
    info: number | string
    icon: React.ReactNode
    tooltip: React.ReactNode
}

export const InfoIconList = (props: { values: InfoIconValue[], horizontal?: boolean }) => {
    const {values, horizontal} = props
    return (
        <div style={{display: horizontal ? "flex" : undefined}}>
            {props.values.map((value, idx) => {
                return (
                    <InfoIcon value={value} key={idx} style={{marginBottom: horizontal ? 0 : 4, marginLeft: idx === 0 ? 0 : spacing(1)}}/>
                )
            })}
        </div>
    )
}

const InfoIcon = (props: { value: InfoIconValue, style?: React.CSSProperties }) => {
    return (
        <Tooltip title={props.value.tooltip}>
            <div style={{display: "flex", alignItems: "center", ...props.style}}>
                <Typography variant={"h6"} style={{marginRight: spacing(1), width: 40, textAlign: "right"}}>{props.value.info}</Typography>
                <div style={{display: "flex", width: 24}}>
                    {props.value.icon}
                </div>
            </div>
        </Tooltip>
    )
}
