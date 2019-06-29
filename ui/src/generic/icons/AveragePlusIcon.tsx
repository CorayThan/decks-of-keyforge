import * as React from "react"
import AveragePlus from "../imgs/average-plus.svg"

export const AveragePlusIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Average Plus"} src={AveragePlus} style={{height: props.height ? props.height : 12, ...props.style}}/>
    )
}
