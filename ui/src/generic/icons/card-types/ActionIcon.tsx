import * as React from "react"
import Action from "./action.svg"

export const ActionIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Action} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
