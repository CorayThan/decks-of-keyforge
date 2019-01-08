import * as React from "react"
import Fist from "../imgs/fist.svg"

export const FistIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Fist} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
