import * as React from "react"
import patreon from "../imgs/patreon.png"

export const PatreonIcon = (props: {height?: number, style?: React.CSSProperties}) => (
    <img src={patreon} style={{height: props.height ? props.height : 24, ...props.style}}/>
)
