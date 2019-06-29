import * as React from "react"
import AboveAveragePlus from "../imgs/above-average-plus.svg"

export const AboveAveragePlusIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Above Average Plus"} src={AboveAveragePlus} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
