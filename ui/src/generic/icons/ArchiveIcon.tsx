import * as React from "react"
import Archive from "../imgs/archive-icon.svg"

export const ArchiveIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Archive"} src={Archive} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
