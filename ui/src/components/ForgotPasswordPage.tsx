import { Card, CardActions, CardContent, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { emailStore } from "../emails/EmailStore"
import { KeyButton } from "../mui-restyled/KeyButton"

@observer
export class ForgotPasswordPage extends React.Component {

    @observable
    email = ""

    @observable
    error = false

    sendReset = () => {
        this.error = false
        if (!this.email.trim()) {
            this.error = true
            log.info("Setting error true in reset password.")
            return
        }
        emailStore.sendReset(this.email.trim())
    }

    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div>
                    <Card style={{maxWidth: 400, margin: spacing(2)}}>
                        <CardContent>
                            <Typography variant={"h6"} gutterBottom={true}>
                                Reset Password
                            </Typography>
                            <Typography style={{marginBottom: spacing(1)}}>
                                Use this form to reset your password. It will send an email to your email address with a reset link.
                            </Typography>
                            <Typography style={{marginBottom: spacing(1)}}>
                                If there is a typo in your email address and you forgot your password it will not be possible to recover your account,
                                but you can create a new one and still add your decks.
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}}>
                                If you do not receive a reset email, try whitelisting the Decks of KeyForge email address by adding "noreply@decksofkeyforge.com" to
                                your email contacts.
                            </Typography>
                            <TextField
                                variant={"outlined"}
                                label={"Email"}
                                value={this.email}
                                onChange={(event) => this.email = event.target.value}
                                autoFocus={true}
                                fullWidth={true}
                                error={this.error}
                            />
                        </CardContent>
                        <CardActions>
                            <div style={{flexGrow: 1}}/>
                            <KeyButton
                                color={"primary"}
                                variant={"contained"}
                                onClick={this.sendReset}
                                loading={emailStore.sendingReset}
                            >
                                Send Reset Email
                            </KeyButton>
                        </CardActions>
                    </Card>
                </div>
            </div>
        )
    }
}