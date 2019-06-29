import * as React from "react"
import AverageMinus from "../imgs/average-minus.svg"

export const AverageMinusIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Average Minus"} src={AverageMinus} style={{height: props.height ? props.height : 12, ...props.style}}/>
    )
}
