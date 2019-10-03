import Button from "@material-ui/core/Button"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { DiscordIcon } from "../../generic/icons/DiscordIcon"

export const decksOfKeyForgeDiscord = "https://discord.gg/T5taTHm"

export class DiscordButton extends React.Component<{ style?: React.CSSProperties }> {
    render() {
        return (
            <Button
                variant={"contained"}
                color={"primary"}
                href={decksOfKeyForgeDiscord}
                target={"_blank"}
                style={{borderRadius: 4, ...this.props.style, paddingTop: 4, paddingBottom: 4}}
                size={"large"}
            >
                <DiscordIcon full={true}/>
            </Button>
        )
    }
}

export class DiscordNamedButton extends React.Component<{ name: string, link: string, style?: React.CSSProperties }> {
    render() {
        const {name, link, style} = this.props
        return (
            <Button
                href={link}
                target={"_blank"}
                style={style}
            >
                <DiscordIcon height={24} full={false} style={{marginRight: spacing(1)}}/>
                {name}
            </Button>
        )
    }
}
