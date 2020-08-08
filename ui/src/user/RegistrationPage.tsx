import { Box, Card, Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { latestVersion } from "../about/ReleaseNotes"
import { KeyTopbarRegistration } from "../components/KeyTopbarRegistration"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, prettyJson, Utils } from "../config/Utils"
import { Country, CountryUtils } from "../generated-src/Country"
import { countryToLabel } from "../generic/CountryUtils"
import { DokIcon } from "../generic/icons/DokIcon"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { messageStore } from "../ui/MessageStore"
import { LoginPop } from "./LoginPop"
import { userStore } from "./UserStore"

@observer
export class RegistrationPage extends React.Component {

    private static readonly USERNAME_REGEX = /^(\d|\w|-|_)+$/

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
    allowUsersToSeeDeckOwnership = false
    @observable
    acceptsTrades = false
    @observable
    agreesToTerms = false
    @observable
    country: Country | "" = ""

    signUp = (submitEvent: React.FormEvent) => {
        submitEvent.preventDefault()
        let error
        if (this.password.trim() !== this.confirmPassword) {
            error = "Please make sure your password and confirm password match."
        }
        if (this.password.length < 8) {
            error = "Please choose a password at least 8 characters long."
        }
        const username = this.username.trim()
        if (username.length < 1) {
            error = "Please enter a username."
        }
        if (this.email.length < 1 || !Utils.validateEmail(this.email)) {
            error = "Please enter a valid email address."
        }
        if (!RegistrationPage.USERNAME_REGEX.test(username)) {
            error = "Please choose a username with letters, numbers, hyphen, and underscore."
        }

        if (error) {
            messageStore.setErrorMessage(error)
            return
        }
        const country = this.country === "" ? undefined : this.country
        userStore.registerAccount({
            email: this.email,
            password: this.password,
            username,
            publicContactInfo: this.publicContactInfo,
            allowUsersToSeeDeckOwnership: this.allowUsersToSeeDeckOwnership,
            acceptsTrades: this.acceptsTrades,
            country,
            lastVersionSeen: latestVersion
        })
    }

    componentDidMount() {
        userStore.loginInProgress = false
    }

    render() {
        const {loginInProgress, user} = userStore
        log.debug(`Render reg page, user ${prettyJson(user)} loginInProgress: ${loginInProgress}`)
        if (user) {
            return <Redirect to={Routes.landing}/>
        }
        return (
            <KeyTopbarRegistration
                name={"Decks of KeyForge"}
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
                            <Grid container={true} spacing={2}>
                                <Grid item={true} xs={6}>
                                    <TextField
                                        id={"dok-email"}
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
                                        id={"dok-password"}
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
                                <Grid item={true} xs={12}>
                                    <TextField
                                        select
                                        label="Country"
                                        value={this.country}
                                        onChange={event => this.country = event.target.value as Country}
                                        helperText="For searching decks for sale"
                                        variant="outlined"
                                        fullWidth={true}
                                    >
                                        {CountryUtils.values.map(country => (
                                            <MenuItem key={country} value={country}>
                                                {countryToLabel(country)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item={true} xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.allowUsersToSeeDeckOwnership}
                                                onChange={(event) => this.allowUsersToSeeDeckOwnership = event.target.checked}
                                                tabIndex={6}
                                            />
                                        }
                                        label={"Let anyone see my decks"}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.acceptsTrades}
                                                onChange={(event) => this.acceptsTrades = event.target.checked}
                                                tabIndex={7}
                                            />
                                        }
                                        label={"Accept trades on decks for sale"}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.agreesToTerms}
                                                onChange={(event) => this.agreesToTerms = event.target.checked}
                                                tabIndex={8}
                                            />
                                        }
                                        label={"I agree to the Code of Conduct, Terms of Use and Privacy Policy"}
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={1} display={"flex"} justifyContent={"space-between"}>
                                <LinkButton
                                    size={"small"}
                                    href={Routes.codeOfConduct}
                                    newWindow={true}
                                >
                                    Code of Conduct
                                </LinkButton>
                                <LinkButton
                                    size={"small"}
                                    href={Routes.termsOfUse}
                                    newWindow={true}
                                >
                                    Terms of Use
                                </LinkButton>
                                <LinkButton
                                    size={"small"}
                                    href={Routes.privacyPolicy}
                                    newWindow={true}
                                >
                                    Privacy Policy
                                </LinkButton>
                            </Box>
                            <KeyButton
                                style={{marginTop: spacing(2)}}
                                variant={"contained"}
                                color={"primary"}
                                type={"submit"}
                                fullWidth={true}
                                tabIndex={9}
                                loading={loginInProgress}
                                disabled={!this.agreesToTerms}
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
