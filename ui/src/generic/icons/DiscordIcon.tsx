import * as React from "react"
import discordLogoFull from "../imgs/discord-logo-full.svg"
import discordLogo from "../imgs/discord-logo.svg"

export const DiscordIcon = (props: { full?: boolean, primary?: boolean, height?: number, style?: React.CSSProperties }) => (
    <img alt={"Discord Icon"} src={props.full ? discordLogoFull : discordLogo} style={{height: props.height ? props.height : 34, ...props.style}}/>
)


