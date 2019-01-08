import * as React from "react"
import Best from "../imgs/best.svg"

export const BestIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Best} style={{height: props.height ? props.height : 30, ...props.style}}/>
    )
}
