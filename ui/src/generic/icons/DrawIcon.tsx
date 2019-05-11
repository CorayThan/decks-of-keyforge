import * as React from "react"
import Draw from "../imgs/draw-icon.svg"

export const DrawIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Draw} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
