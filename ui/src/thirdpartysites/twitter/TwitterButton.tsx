import ButtonBase from "@material-ui/core/ButtonBase"
import * as React from "react"
import { TwitterIcon } from "../../generic/icons/TwitterIcon"

export class TwitterButton extends React.Component<{style?: React.CSSProperties}> {
    render() {
        return (
            <ButtonBase
                href={"https://twitter.com/CorayThan"}
                target={"_blank"}
                style={{borderRadius: 4, ...this.props.style}}
            >
                <TwitterIcon/>
            </ButtonBase>
        )
    }
}
