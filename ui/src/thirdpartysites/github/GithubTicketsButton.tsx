import { observer } from "mobx-react"
import * as React from "react"
import { LinkButton } from "../../mui-restyled/LinkButton"

@observer
export class GithubTicketsButton extends React.Component<{ size?: "small" | "medium" | "large", style?: React.CSSProperties }> {
    render() {
        return (
            <LinkButton
                style={this.props.style}
                color={"primary"}
                variant={"contained"}
                href={"https://github.com/CorayThan/decks-of-keyforge/issues"}
                newWindow={true}
                size={this.props.size ?? "large"}
            >
                Report an Issue
            </LinkButton>
        )
    }
}
