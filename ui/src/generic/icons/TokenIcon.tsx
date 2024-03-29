import * as React from "react"
import Creature from "../imgs/token.svg"

export const TokenIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Creature} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
