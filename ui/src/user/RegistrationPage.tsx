import Card from "@material-ui/core/Card/Card"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import Grid from "@material-ui/core/Grid/Grid"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { KeyTopbarRegistration } from "../components/KeyTopbarRegistration"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, prettyJson, Utils } from "../config/Utils"
import { DokIcon } from "../generic/icons/DokIcon"
import { KeyButton } from "../mui-restyled/KeyButton"
import { MessageStore } from "../ui/MessageStore"
import { LoginPop } from "./LoginPop"
import { UserStore } from "./UserStore"

@observer
export class RegistrationPage extends React.Component {

    private static readonly USERNAME_REGEX = /(\d|\w|-|_)+/

    @observable
    email = Utils.isDev() ? "coraythan@gmail.com" : ""
    @observable
    username = Utils.isDev() ? "stuff" : ""
    @observable
    password = Utils.isDev() ? "stuffstuff" : ""
    @observable
    confirmPassword = Utils.isDev() ? "stuffstuff" : ""
    @observable
    publicContactInfo = ""
    @observable
    allowUsersToSeeDeckOwnership: boolean = false

    signUp = (submitEvent: React.FormEvent) => {
        submitEvent.preventDefault()
        let error
        if (this.password !== this.confirmPassword) {
            error = "Please make sure your password and confirm password match."
        }
        if (this.password.length < 8) {
            error = "Please choose a password at least 8 characters long."
        }
        if (this.username.length < 1) {
            error = "Please enter a username."
        }
        if (this.email.length < 1 || !Utils.validateEmail(this.email)) {
            error = "Please enter a valid email address."
        }
        if (!this.username.match(RegistrationPage.USERNAME_REGEX)) {
            error = "Please choose a username with only letters, numbers, hyphen, and underscore."
        }

        if (error) {
            MessageStore.instance.setErrorMessage(error)
            return
        }
        UserStore.instance.registerAccount({
            email: this.email,
            password: this.password,
            username: this.username,
            publicContactInfo: this.publicContactInfo,
            allowUsersToSeeDeckOwnership: this.allowUsersToSeeDeckOwnership
        })
    }

    componentDidMount() {
        UserStore.instance.loginInProgress = false
    }

    render() {
        const {loginInProgress, user} = UserStore.instance
        log.debug(`Render reg page, user ${prettyJson(user)} loginInProgress: ${loginInProgress}`)
        if (user) {
            return <Redirect to={Routes.decks}/>
        }
        return (
            <KeyTopbarRegistration
                name={"Decks of Keyforge"}
                rightContent={(
                    <LoginPop/>
                )}
            >
                <div style={{margin: spacing(4), display: "flex", justifyContent: "center"}}>
                    <Card
                        style={{
                            width: 480,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: spacing(4),
                        }}
                    >

                        <DokIcon height={100} style={{marginBottom: spacing(2)}}/>
                        <Typography variant={"h3"} style={{marginBottom: spacing(2)}}>Sign up</Typography>
                        <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                            Evaluate, sell and trade your decks
                        </Typography>
                        <form onSubmit={this.signUp}>
                            <Grid container={true} spacing={16}>
                                <Grid item={true} xs={6}>
                                    <TextField
                                        variant={"outlined"}
                                        label={"Email"}
                                        type={"email"}
                                        value={this.email}
                                        onChange={(event) => {
                                            log.debug(`In email input ${this.email} and ${event.target.value}`)
                                            this.email = event.target.value
                                        }}
                                        style={{marginBottom: spacing(2)}}
                                        helperText={"We won't share it"}
                                        InputProps={{inputProps: {tabIndex: 1}}}
                                        autoFocus={true}
                                    />
                                    <TextField
                                        variant={"outlined"}
                                        label={"Password"}
                                        type={"password"}
                                        value={this.password}
                                        onChange={(event) => this.password = event.target.value}
                                        style={{marginBottom: spacing(2)}}
                                        InputProps={{inputProps: {tabIndex: 3}}}
                                    />
                                </Grid>
                                <Grid item={true} xs={6}>
                                    <TextField
                                        variant={"outlined"}
                                        label={"Username"}
                                        value={this.username}
                                        onChange={(event) => this.username = event.target.value}
                                        style={{marginBottom: spacing(2)}}
                                        InputProps={{inputProps: {tabIndex: 2}}}
                                    />
                                    <div
                                        style={{marginBottom: spacing(2), paddingTop: 19}}
                                    >
                                        <TextField
                                            variant={"outlined"}
                                            label={"Repeat Password"}
                                            type={"password"}
                                            value={this.confirmPassword}
                                            onChange={(event) => this.confirmPassword = event.target.value}
                                            InputProps={{inputProps: {tabIndex: 4}}}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                            <TextField
                                variant={"outlined"}
                                label={"Contact Info"}
                                helperText={"Optional public info for users to contact you for sales and trades."}
                                value={this.publicContactInfo}
                                onChange={(event) => this.publicContactInfo = event.target.value}
                                fullWidth={true}
                                multiline={true}
                                rows={2}
                                rowsMax={5}
                                style={{marginBottom: spacing(2)}}
                                required={false}
                                InputProps={{inputProps: {tabIndex: 5}}}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.allowUsersToSeeDeckOwnership}
                                        onChange={(event) => this.allowUsersToSeeDeckOwnership = event.target.checked}
                                        tabIndex={6}
                                    />
                                }
                                style={{marginBottom: spacing(2)}}
                                label={"Allow anyone to see which decks I own"}
                            />
                            <KeyButton
                                variant={"contained"}
                                color={"secondary"}
                                type={"submit"}
                                fullWidth={true}
                                tabIndex={7}
                                loading={loginInProgress}
                            >
                                Create Account
                            </KeyButton>
                        </form>
                    </Card>
                </div>
            </KeyTopbarRegistration>
        )
    }
}
