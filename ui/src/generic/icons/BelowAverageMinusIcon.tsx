import * as React from "react"
import BelowAverageMinus from "../imgs/below-average-minus.svg"

export const BelowAverageMinusIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={BelowAverageMinus} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
