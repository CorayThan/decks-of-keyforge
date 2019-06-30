import * as React from "react"
import Anti from "../imgs/anti-icon.png"

export const AntiIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Anti} style={{height: props.height ? props.height : 36, ...props.style}}/>
    )
}
