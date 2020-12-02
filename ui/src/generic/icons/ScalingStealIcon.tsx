import * as React from "react"
import ScalingSteal from "../imgs/scaling-steal-icon.svg"

export const ScalingStealIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={ScalingSteal} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
