import { observer } from "mobx-react"
import * as React from "react"
import { themeStore } from "../../config/MuiConfig"
import discordLogoFull from "../imgs/discord-logo-full.svg"
import discordLogoWhite from "../imgs/discord-logo-white.svg"
import discordLogo from "../imgs/discord-logo.svg"

export const DiscordIcon = observer((props: { full?: boolean, primary?: boolean, height?: number, style?: React.CSSProperties }) => (
    <img alt={"Discord Icon"} src={props.full ? discordLogoFull : themeStore.darkMode ? discordLogoWhite : discordLogo} style={{height: props.height ? props.height : 34, ...props.style}}/>
))
