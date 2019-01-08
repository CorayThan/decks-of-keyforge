import * as React from "react"
import Worst from "../imgs/worst.svg"

export const WorstIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Worst} style={{height: props.height ? props.height : 30, ...props.style}}/>
    )
}
