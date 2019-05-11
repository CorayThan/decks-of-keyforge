import * as React from "react"
import KeyCheat from "../imgs/key-cheat-icon.svg"

export const KeyCheatIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={KeyCheat} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
