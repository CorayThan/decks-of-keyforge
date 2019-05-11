import * as React from "react"
import Amber from "../imgs/amber-icon.svg"

export const AmberIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Amber} style={{height: props.width ? props.width : 20, ...props.style}}/>
    )
}
