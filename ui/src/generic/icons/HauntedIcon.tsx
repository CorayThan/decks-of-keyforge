import * as React from "react"
import Haunted from "../imgs/haunted.svg"

export const HauntedIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Haunted} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
