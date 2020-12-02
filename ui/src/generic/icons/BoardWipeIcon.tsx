import * as React from "react"
import BoardWipe from "../imgs/board-wipe-icon.svg"

export const BoardWipeIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={BoardWipe} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
