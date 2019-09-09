import { Paper, TextField, Typography } from "@material-ui/core"
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
                    <Typography
                        variant={"h4"}
                        style={{margin: spacing(2), marginTop: spacing(4)}}
                    >
                        Forgot your password?
                    </Typography>
                    <Paper style={{maxWidth: 400, margin: spacing(2), padding: spacing(2)}}>
                        <Typography style={{marginBottom: spacing(1)}}>
                            You can use this form to reset your password.
                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            It will send an email to your email address with a reset link.
                        </Typography>
                        <Typography style={{marginBottom: spacing(2)}}>
                            If there is a typo in your email address and you forgot your password it will not be possible to recover your account,
                            but you can create a new one and still add your decks.
                        </Typography>
                        <TextField
                            variant={"outlined"}
                            label={"Email"}
                            value={this.email}
                            onChange={(event) => this.email = event.target.value}
                            style={{marginBottom: spacing(2)}}
                            autoFocus={true}
                            fullWidth={true}
                            error={this.error}
                        />
                        <KeyButton
                            color={"primary"}
                            variant={"contained"}
                            onClick={this.sendReset}
                            loading={emailStore.sendingReset}
                        >
                            Send Reset Email
                        </KeyButton>
                    </Paper>
                </div>
            </div>
        )
    }
}