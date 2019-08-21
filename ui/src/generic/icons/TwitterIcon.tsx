import * as React from "react"
import twitter from "../imgs/twitter.svg"

export const TwitterIcon = (props: { height?: number, style?: React.CSSProperties }) => (
    <img alt={"Twitter"} src={twitter} style={{height: props.height ? props.height : 48, ...props.style}}/>
)
