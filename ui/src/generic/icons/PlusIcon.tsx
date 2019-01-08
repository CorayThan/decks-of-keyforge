import * as React from "react"
import Plus from "../imgs/plus.svg"

export const PlusIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Plus} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
