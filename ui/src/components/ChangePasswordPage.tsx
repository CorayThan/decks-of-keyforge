import { Paper, TextField, Typography } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"

export class ChangePasswordPage extends React.Component<RouteComponentProps<{resetCode: string}>> {
    render() {
        const resetCode = this.props.match.params.resetCode
        return <ChangePasswordView resetCode={resetCode} />
    }
}

@observer
export class ChangePasswordView extends React.Component<{resetCode: string}> {
    @observable
    password = ""
    @observable
    confirmPassword = ""

    sendReset = () => {
        let error
        if (this.password.trim() !== this.confirmPassword) {
            error = "Please make sure your password and confirm password match."
        }
        if (this.password.length < 8) {
            error = "Please choose a password at least 8 characters long."
        }
        if (error) {
            messageStore.setErrorMessage(error)
            return
        }
        userStore.changePassword(this.props.resetCode, this.password.trim())
    }

    constructor(props: {resetCode: string}) {
        super(props)
        makeObservable(this)
    }

    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div>
                    <Typography
                        variant={"h4"}
                        style={{margin: spacing(2), marginTop: spacing(4)}}
                    >
                        Change your password
                    </Typography>
                    <Paper style={{maxWidth: 400, margin: spacing(2), padding: spacing(2)}}>
                        <Typography style={{marginBottom: spacing(2)}}>
                            Please select a new password
                        </Typography>
                        <TextField
                            variant={"outlined"}
                            label={"Password"}
                            type={"password"}
                            value={this.password}
                            onChange={(event) => this.password = event.target.value}
                            style={{marginBottom: spacing(2)}}
                        />
                        <TextField
                            variant={"outlined"}
                            label={"Repeat Password"}
                            type={"password"}
                            value={this.confirmPassword}
                            onChange={(event) => this.confirmPassword = event.target.value}
                            style={{marginBottom: spacing(2)}}
                        />
                        <KeyButton color={"primary"} variant={"contained"} onClick={this.sendReset} loading={userStore.changingPassword}>
                            Change Password
                        </KeyButton>
                    </Paper>
                </div>
            </div>
        )
    }
}