import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { PatreonIcon } from "../../generic/icons/PatreonIcon"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { userStore } from "../../user/UserStore"

@observer
export class PatronButton extends React.Component<{ size?: "small" | "medium" | "large", link?: string }> {
    render() {
        return (
            <LinkButton
                color={"primary"}
                variant={"contained"}
                href={this.props.link ?? "https://www.patreon.com/decksofkeyforge"}
                target={"_blank"}
                rel={"noopener noreferrer"}
                size={this.props.size}
            >
                <PatreonIcon primary={false}/>
                <div style={{marginRight: spacing(1)}}/>
                {userStore.patron ? "Patreon" : "Become a Patron"}
            </LinkButton>
        )
    }
}
