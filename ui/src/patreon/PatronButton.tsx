import { ButtonProps } from "@material-ui/core/Button"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { PatreonIcon } from "../generic/icons/PatreonIcon"
import { KeyButton } from "../mui-restyled/KeyButton"
import { userStore } from "../user/UserStore"

@observer
export class PatronButton extends React.Component<ButtonProps & { primary?: boolean }> {
    render() {
        const {primary, ...rest} = this.props
        if (userStore.patron) {
            return null
        }
        return (
            <KeyButton
                color={"inherit"}
                href={"https://www.patreon.com/decksofkeyforge"}
                target={"_blank"}
                {...rest}
            >
                <PatreonIcon primary={primary}/>
                <div style={{marginRight: spacing(1)}}/>
                Become a Patron
            </KeyButton>
        )
    }
}
