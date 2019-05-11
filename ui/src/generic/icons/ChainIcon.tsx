import * as React from "react"
import Chain from "../imgs/chains.png"

export const ChainIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Chain} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
