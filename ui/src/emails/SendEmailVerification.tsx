import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { userStore } from "../user/UserStore"
import { emailStore } from "./EmailStore"

@observer
export class SendEmailVerification extends React.Component<{ message: string }> {
    render() {
        if (userStore.emailVerified) {
            return null
        }
        return (
            <div style={{marginBottom: spacing(1)}}>
                <Typography color={"error"} style={{marginBottom: spacing(1)}}>
                    {this.props.message}
                </Typography>
                <KeyButton color={"primary"} onClick={emailStore.sendEmailVerification} loading={emailStore.sendingEmailVerification}>
                    Send Verification Email
                </KeyButton>
            </div>
        )
    }
}