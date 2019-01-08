import * as React from "react"
import BelowAverage from "../imgs/below-average.svg"

export const BelowAverageIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={BelowAverage} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
