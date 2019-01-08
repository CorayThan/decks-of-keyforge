import * as React from "react"
import AboveAverage from "../imgs/above-average.svg"

export const AboveAverageIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={AboveAverage} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
