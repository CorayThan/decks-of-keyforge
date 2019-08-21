import Button from "@material-ui/core/Button"
import * as React from "react"
import { DiscordIcon } from "../../generic/icons/DiscordIcon"

export class DiscordButton extends React.Component<{ style?: React.CSSProperties }> {
    render() {
        return (
            <Button
                variant={"contained"}
                color={"primary"}
                href={"https://discord.gg/T5taTHm"}
                target={"_blank"}
                style={{borderRadius: 4, ...this.props.style}}
            >
                <DiscordIcon full={true}/>
            </Button>
        )
    }
}