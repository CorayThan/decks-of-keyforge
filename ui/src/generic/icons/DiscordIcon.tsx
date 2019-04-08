import * as React from "react"
import discordLogo from "../imgs/discord-logo.svg"

export const DiscordIcon = (props: { primary?: boolean, height?: number, style?: React.CSSProperties }) => (
    <img alt={"Discord Icon"} src={discordLogo} style={{height: props.height ? props.height : 36, ...props.style}}/>
)
