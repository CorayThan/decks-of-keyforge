import * as React from "react"
import Tide from "../imgs/tide-icon.svg"

export const TideIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Tide} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
