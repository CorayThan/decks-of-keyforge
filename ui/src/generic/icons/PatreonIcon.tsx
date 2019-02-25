import * as React from "react"
import patreonPrimary from "../imgs/patreon-primary.png"
import patreon from "../imgs/patreon.png"

export const PatreonIcon = (props: { primary?: boolean, height?: number, style?: React.CSSProperties }) => (
    <img alt={"Patreon Button"} src={props.primary ? patreonPrimary : patreon} style={{height: props.height ? props.height : 24, ...props.style}}/>
)
