import * as React from "react"
import Average from "../imgs/average.svg"

export const AverageIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Average} style={{height: props.height ? props.height : 12, ...props.style}}/>
    )
}
