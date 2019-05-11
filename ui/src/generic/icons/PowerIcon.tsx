import * as React from "react"
import PowerLevel from "../imgs/power-level.png"

export const PowerIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={PowerLevel} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
