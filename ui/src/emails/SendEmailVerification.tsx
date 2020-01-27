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
        if (userStore.emailForSellingIsVerified) {
            return null
        }
        return (
            <div style={{marginBottom: spacing(1)}}>
                <Typography color={"error"} style={{marginBottom: spacing(1)}}>
                    {this.props.message}
                </Typography>
                <Typography color={"textSecondary"} style={{marginBottom: spacing(1)}}>
                    If you do not receive a verification email, try whitelisting the Decks of KeyForge email address by adding "noreply@decksofkeyforge.com" to
                    your email contacts.
                </Typography>
                {userStore.sellerEmail != null ? (
                    <Typography color={"textSecondary"} style={{marginBottom: spacing(1)}}>
                        Since you have a seller email specified, we will be verifying that email: {userStore.sellerEmail}
                    </Typography>
                ) : (
                    <Typography color={"textSecondary"} style={{marginBottom: spacing(1)}}>
                        We will be verifying your email: {userStore.email}
                    </Typography>
                )}
                <KeyButton color={"primary"} onClick={emailStore.sendEmailVerification} loading={emailStore.sendingEmailVerification}>
                    Send Verification Email
                </KeyButton>
            </div>
        )
    }
}