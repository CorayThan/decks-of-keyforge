import {
    Button,
    CardActions,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    TextField
} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as History from "history"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import ReactDOM from "react-dom"
import { RouteComponentProps } from "react-router"
import { spacing, themeStore } from "../config/MuiConfig"
import { AboutSubPaths, MyDokSubPaths, Routes } from "../config/Routes"
import { log, prettyJson, Utils } from "../config/Utils"
import { forSaleNotificationsStore } from "../decks/salenotifications/ForSaleNotificationsStore"
import { countries, countryToLabel, euCountries } from "../generic/CountryUtils"
import { EventValue } from "../generic/EventValue"
import { PatreonIcon } from "../generic/icons/PatreonIcon"
import { KeyCard } from "../generic/KeyCard"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader, LoaderSize } from "../mui-restyled/Loader"
import { LinkPatreon } from "../thirdpartysites/patreon/LinkPatreon"
import { patronRewardLevelName } from "../thirdpartysites/patreon/PatreonRewardsTier"
import { patreonStore } from "../thirdpartysites/patreon/PatreonStore"
import { messageStore } from "../ui/MessageStore"
import { uiStore } from "../ui/UiStore"
import { KeyUserDto } from "../user/KeyUser"
import { UserProfileUpdate } from "../user/UserProfile"
import { userStore } from "../user/UserStore"

interface MyProfileProps extends RouteComponentProps<{}> {

}

@observer
export class MyProfile extends React.Component<MyProfileProps> {

    render() {
        const profile = userStore.user
        if (!profile) {
            return <Loader/>
        }
        const queryParams = QueryString.parse(this.props.location.search) as { code?: string }
        const patreonCode = queryParams == null ? undefined : queryParams.code
        return <MyProfileInner profile={profile} patreonCode={patreonCode} history={this.props.history}/>
    }
}

interface MyProfileInnerProps {
    profile: KeyUserDto
    patreonCode?: string
    history: History.History
}

@observer
class MyProfileInner extends React.Component<MyProfileInnerProps> {

    @observable
    email: string
    @observable
    contactInfo: string
    @observable
    allowUsersToSeeDeckOwnership: boolean
    @observable
    allowsTrades: boolean
    @observable
    country: string

    @observable
    currencySymbol = "$"
    @observable
    preferredCountries: string[]

    @observable
    preferredCountriesLabelWidth = 0

    @observable
    confirmOpen = false

    @observable
    sellerEmail: string

    @observable
    discord: string

    @observable
    storeName: string

    @observable
    shippingCost: string

    @observable
    autoRenewListings = false

    update?: UserProfileUpdate

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buyingCountriesInputLabelRef: any

    constructor(props: MyProfileInnerProps) {
        super(props)
        const {
            publicContactInfo, allowUsersToSeeDeckOwnership, country, preferredCountries, email, shippingCost,
            sellerEmail, discord, storeName, currencySymbol, allowsTrades, autoRenewListings
        } = props.profile
        this.email = email
        this.contactInfo = publicContactInfo ? publicContactInfo : ""
        this.shippingCost = shippingCost ? shippingCost : ""
        this.allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership
        this.allowsTrades = allowsTrades
        this.country = country ? country : ""
        this.preferredCountries = preferredCountries ? preferredCountries : []
        this.sellerEmail = sellerEmail ? sellerEmail : ""
        this.discord = discord ? discord : ""
        this.storeName = storeName ? storeName : ""
        this.currencySymbol = currencySymbol
        this.autoRenewListings = autoRenewListings
        uiStore.setTopbarValues(`My DoK`, "My DoK", "")

        forSaleNotificationsStore.queries = undefined
    }

    componentDidMount(): void {
        // eslint-disable-next-line
        this.preferredCountriesLabelWidth = (ReactDOM.findDOMNode(this.buyingCountriesInputLabelRef) as any).offsetWidth
        this.update = undefined
        const {patreonCode, history} = this.props
        if (patreonCode != null) {
            log.debug(`Linking patreon account with access code ${patreonCode}`)
            patreonStore.linkAccount(patreonCode)
            history.replace(Routes.myProfile)
        }
    }

    updateProfile = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        const publicContactInfo = this.contactInfo.trim().length === 0 ? undefined : this.contactInfo.trim()
        if (publicContactInfo && publicContactInfo.length > 1500) {
            messageStore.setWarningMessage(`Please make your public contact info 1500 or fewer characters long. It is currently ${publicContactInfo.length} characters.`)
            return
        }
        const shippingCost = this.shippingCost.trim().length === 0 ? undefined : this.shippingCost.trim()
        if (shippingCost && shippingCost.length > 250) {
            messageStore.setWarningMessage(`Please make your shipping info 250 or fewer characters long. It is currently ${shippingCost.length} characters.`)
            return
        }
        const email = this.email.trim() === this.props.profile.email ? undefined : this.email.trim()
        if (email != null && (email.length < 1 || !Utils.validateEmail(email))) {
            messageStore.setWarningMessage("Please enter a valid email address.")
            return
        }
        const sellerEmailTrimmed = this.sellerEmail.trim()
        const sellerEmail = sellerEmailTrimmed.length === 0 ? undefined : sellerEmailTrimmed
        if (sellerEmail != null && (sellerEmail.length < 1 || !Utils.validateEmail(sellerEmail))) {
            messageStore.setWarningMessage("Please enter a valid seller email address.")
            return
        }
        const discordTrimmed = this.discord.trim()
        const discord = discordTrimmed.length === 0 ? undefined : discordTrimmed
        if (discord != null && !discord.includes("#")) {
            messageStore.setWarningMessage(`Please include a valid discord user id, e.g. "CorayThan#9734"`)
            return
        }

        const storeNameTrimmed = this.storeName.trim()
        const storeName = storeNameTrimmed.length === 0 ? undefined : storeNameTrimmed
        if (storeNameTrimmed.length > 30) {
            messageStore.setWarningMessage(`Please make your store name 30 or fewer characters.`)
            return
        }

        const currencySymbolTrimmed = this.currencySymbol.trim()
        if (currencySymbolTrimmed.length > 5) {
            messageStore.setWarningMessage(`Currency symbol must be five or fewer characters.`)
            return
        } else if (currencySymbolTrimmed.length === 0) {
            messageStore.setWarningMessage(`Currency symbol be at least one character.`)
            return
        }
        const toUpdate: UserProfileUpdate = {
            email,
            publicContactInfo,
            sellerEmail,
            discord,
            storeName,
            shippingCost,
            currencySymbol: currencySymbolTrimmed,
            allowsTrades: this.allowsTrades,
            allowUsersToSeeDeckOwnership: this.allowUsersToSeeDeckOwnership,
            country: this.country.length === 0 ? undefined : this.country,
            preferredCountries: this.preferredCountries.length === 0 ? undefined : this.preferredCountries,
            autoRenewListings: this.autoRenewListings
        }

        if (email == null) {
            this.actuallyUpdate(toUpdate)
        } else {
            // display modal confirmation
            this.update = toUpdate
            this.confirmOpen = true
        }
    }

    actuallyUpdate = (update: UserProfileUpdate) => {
        userStore.updateUserProfile(update)
    }

    addEuCountries = () => {
        this.preferredCountries.push(...euCountries)
        const asSet = new Set(this.preferredCountries)
        this.preferredCountries = Array.from(asSet)
    }

    render() {
        const profile = this.props.profile

        return (
            <div style={{marginLeft: spacing(2), marginRight: spacing(2), display: "flex", justifyContent: "center"}}>
                {patreonStore.linkingPatreon && (
                    <Dialog
                        open={patreonStore.linkingPatreon}
                    >
                        <DialogTitle style={{display: "flex", justifyContent: "center"}}>
                            <PatreonIcon height={40} style={{marginRight: spacing(2)}} primary={true}/>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                We're linking your Patreon Account. Please be patient.
                            </DialogContentText>
                            <Loader size={LoaderSize.MEDIUM} style={{margin: spacing(2, 0)}}/>
                        </DialogContent>
                    </Dialog>
                )}
                <Dialog
                    open={this.confirmOpen}
                    onClose={() => this.confirmOpen = false}
                >
                    <DialogTitle>Change your email?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to change your email to "{this.update && this.update.email}"? This will be your new login for the site.
                            You will need to sign in again after making this change.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.confirmOpen = false} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            this.confirmOpen = false
                            this.actuallyUpdate(this.update!)
                            this.update = undefined
                        }} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                <form onSubmit={this.updateProfile}>
                    <KeyCard
                        topContents={(
                            <div>
                                <Typography variant={"h4"} style={{color: "#FFFFFF"}}>{profile.username}</Typography>
                            </div>
                        )}
                        style={{maxWidth: 880, margin: 0}}
                    >
                        <CardContent>
                            <Grid container={true} spacing={2}>
                                <Grid item={true} sm={12} md={6}>
                                    <Grid container={true} spacing={2}>
                                        <Grid item={true} xs={12}>
                                            <Typography variant={"h6"}>User Settings</Typography>
                                        </Grid>
                                        {profile.patreonTier != null && (
                                            <Grid item={true} xs={12}>
                                                <PatreonSupporter profile={profile}/>
                                            </Grid>
                                        )}
                                        <Grid item={true} xs={12}>
                                            <TextField
                                                label={"email"}
                                                value={this.email}
                                                onChange={(event: EventValue) => this.email = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                            />
                                        </Grid>
                                        <Grid item={true} xs={12}>
                                            <TextField
                                                select
                                                label="Country"
                                                value={this.country}
                                                onChange={(event: EventValue) => this.country = event.target.value}
                                                variant="outlined"
                                                fullWidth={true}
                                            >
                                                {countries.map(country => (
                                                    <MenuItem key={country} value={country}>
                                                        {countryToLabel(country)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item={true} xs={9}>
                                            <FormControl fullWidth={true} variant={"outlined"}>
                                                <InputLabel
                                                    htmlFor={"buying-countries-input-id"}
                                                    ref={ref => this.buyingCountriesInputLabelRef = ref}
                                                >
                                                    Buying Countries
                                                </InputLabel>
                                                <Select
                                                    multiple={true}
                                                    value={this.preferredCountries}
                                                    onChange={
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        (event: any) => this.preferredCountries = event.target.value
                                                    }
                                                    input={
                                                        <OutlinedInput
                                                            labelWidth={this.preferredCountriesLabelWidth}
                                                            id={"buying-countries-input-id"}
                                                            fullWidth={true}
                                                        />
                                                    }
                                                    renderValue={
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        (selected: any) => selected.join(", ")
                                                    }
                                                    variant={"outlined"}
                                                >
                                                    {countries.map(country => (
                                                        <MenuItem key={country} value={country}>
                                                            <Checkbox checked={this.preferredCountries.indexOf(country) > -1}/>
                                                            <ListItemText primary={countryToLabel(country)}/>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormHelperText style={{marginTop: spacing(1)}}>
                                                Sale search countries
                                            </FormHelperText>
                                        </Grid>
                                        <Grid item={true} xs={3}>
                                            <Button
                                                onClick={this.addEuCountries}
                                            >
                                                Add EU
                                            </Button>
                                        </Grid>
                                        <Grid item={true}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.allowUsersToSeeDeckOwnership}
                                                        onChange={(event) => this.allowUsersToSeeDeckOwnership = event.target.checked}
                                                        tabIndex={6}
                                                    />
                                                }
                                                label={"Let anyone see my decks and user stats"}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.allowsTrades}
                                                        onChange={(event) => this.allowsTrades = event.target.checked}
                                                        tabIndex={7}
                                                    />
                                                }
                                                label={"Open to trading decks for sale"}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={themeStore.darkMode}
                                                        onChange={themeStore.toggleMode}
                                                        tabIndex={8}
                                                        disabled={!userStore.patron}
                                                    />
                                                }
                                                label={"Dark mode (Patron only)"}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.autoRenewListings}
                                                        onChange={() => this.autoRenewListings = !this.autoRenewListings}
                                                        tabIndex={9}
                                                        disabled={!userStore.patron}
                                                    />
                                                }
                                                label={"Autorenew Deck Sales (Patron only)"}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item={true} sm={12} md={6}>
                                    <Grid container={true} spacing={2}>
                                        <Grid item={true} xs={12}>
                                            <Typography variant={"h6"}>Seller Settings</Typography>
                                        </Grid>
                                        {userStore.featuredSeller ? (
                                            <Grid item={true} xs={12}>
                                                <TextField
                                                    label={"store name"}
                                                    value={this.storeName}
                                                    onChange={(event: EventValue) => this.storeName = event.target.value}
                                                    fullWidth={true}
                                                    variant={"outlined"}
                                                />
                                            </Grid>
                                        ) : null}
                                        <Grid item={true} xs={12} sm={6}>
                                            <TextField
                                                label={"public contact email"}
                                                value={this.sellerEmail}
                                                onChange={(event: EventValue) => this.sellerEmail = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                            />
                                        </Grid>
                                        <Grid item={true} xs={12} sm={6}>
                                            <TextField
                                                label={"discord"}
                                                value={this.discord}
                                                onChange={(event: EventValue) => this.discord = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                            />
                                        </Grid>
                                        <Grid item={true} xs={12}>
                                            <TextField
                                                label={"Public contact and trade info"}
                                                value={this.contactInfo}
                                                multiline={true}
                                                rows={3}
                                                onChange={(event: EventValue) => this.contactInfo = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                            />
                                        </Grid>
                                        <Grid item={true} xs={12}>
                                            <TextField
                                                label={"Shipping cost"}
                                                value={this.shippingCost}
                                                multiline={true}
                                                rows={3}
                                                onChange={(event: EventValue) => this.shippingCost = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                                helperText={
                                                    "Include cost to ship in your country, whether you ship internationally, and approximate cost " +
                                                    "to ship internationally"
                                                }
                                            />
                                        </Grid>
                                        <Grid item={true} xs={6}>
                                            <TextField
                                                label={"Currency Symbol"}
                                                value={this.currencySymbol}
                                                onChange={(event: EventValue) => this.currencySymbol = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                                helperText={"For selling decks. e.g. $, €"}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <LinkButton href={Routes.userProfilePage(profile.username)}>Public Profile</LinkButton>
                            <div style={{flexGrow: 1}}/>
                            <LinkPatreon redirectPath={MyDokSubPaths.profile}/>
                            <Button
                                variant={"contained"}
                                type={"submit"}
                                color={"primary"}
                                style={{marginLeft: spacing(2)}}
                            >
                                Save
                            </Button>
                        </CardActions>
                    </KeyCard>
                </form>
            </div>
        )
    }
}

const PatreonSupporter = (props: { profile: KeyUserDto }) => {
    if (props.profile.patreonTier == null) {
        return null
    }
    log.info(`user profile info: ${prettyJson(props.profile)}`)
    return (
        <Grid item={true}>
            <div>
                <Typography style={{marginBottom: spacing(2)}}>Patreon tier: {patronRewardLevelName(props.profile.patreonTier)}</Typography>
                <LinkButton
                    to={AboutSubPaths.patreon}
                    variant={"contained"}
                    color={"primary"}
                >
                    <PatreonIcon style={{marginRight: spacing(1)}}/>
                    Patreon Rewards
                </LinkButton>
            </div>
        </Grid>
    )
}
