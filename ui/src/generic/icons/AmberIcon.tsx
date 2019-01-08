import * as React from "react"
import Amber from "../imgs/amber.svg"

export const AmberIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Amber} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
