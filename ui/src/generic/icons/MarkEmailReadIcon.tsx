import * as React from "react"
import MarkEmailRead from "../imgs/mark-email-read.svg"

export const MarkEmailReadIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Mark Email Read"} src={MarkEmailRead} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
