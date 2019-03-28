import {
    Button,
    CardActions,
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
    Select
} from "@material-ui/core"
import TextField from "@material-ui/core/es/TextField"
import Typography from "@material-ui/core/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import ReactDOM from "react-dom"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { forSaleNotificationsStore } from "../decks/salenotifications/ForSaleNotificationsStore"
import { ForSaleQueryTable } from "../decks/salenotifications/ForSaleQueryTable"
import { DeckFilters, prepareDeckFiltersForQueryString } from "../decks/search/DeckFilters"
import { countries, countryToLabel } from "../generic/Country"
import { KeyCard } from "../generic/KeyCard"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { MessageStore } from "../ui/MessageStore"
import { UiStore } from "../ui/UiStore"
import { KeyUserDto } from "./KeyUser"
import { UserProfileUpdate } from "./UserProfile"
import { userStore } from "./UserStore"

@observer
export class MyProfile extends React.Component {
    render() {
        const profile = userStore.user
        if (!profile) {
            return <Loader/>
        }
        return <MyProfileInner profile={profile}/>
    }
}

interface MyProfileInnerProps {
    profile: KeyUserDto
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
    country: string
    @observable
    preferredCountries: string[]

    @observable
    preferredCountriesLabelWidth = 0

    @observable
    confirmOpen = false

    update?: UserProfileUpdate

    buyingCountriesInputLabelRef: any

    constructor(props: MyProfileInnerProps) {
        super(props)
        const {publicContactInfo, allowUsersToSeeDeckOwnership, country, preferredCountries, email} = props.profile
        this.email = email
        this.contactInfo = publicContactInfo ? publicContactInfo : ""
        this.allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership
        this.country = country ? country : ""
        this.preferredCountries = preferredCountries ? preferredCountries : []
        UiStore.instance.setTopbarValues(`My Profile`, "My Profile", "")

        forSaleNotificationsStore.queries = undefined
    }

    componentDidMount(): void {
        this.preferredCountriesLabelWidth = (ReactDOM.findDOMNode(this.buyingCountriesInputLabelRef) as any).offsetWidth
        forSaleNotificationsStore.findAllForUser()
        this.update = undefined
    }

    updateProfile = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        const publicContactInfo = this.contactInfo.trim().length === 0 ? undefined : this.contactInfo.trim()
        if (publicContactInfo && publicContactInfo.length > 2000) {
            MessageStore.instance.setWarningMessage("Please make your public contact info 2000 or fewer characters long.")
            return
        }
        const email = this.email.trim() === this.props.profile.email ? undefined : this.email.trim()
        if (email != null && (email.length < 1 || !Utils.validateEmail(email))) {
            MessageStore.instance.setWarningMessage("Please enter a valid email address.")
            return
        }

        const toUpdate = {
            email,
            publicContactInfo,
            allowUsersToSeeDeckOwnership: this.allowUsersToSeeDeckOwnership,
            country: this.country.length === 0 ? undefined : this.country,
            preferredCountries: this.preferredCountries.length === 0 ? undefined : this.preferredCountries
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

    render() {
        const profile = this.props.profile
        const filters = new DeckFilters()
        filters.owner = profile.username
        filters.includeUnregistered = true
        const decksLink = Routes.deckSearch(prepareDeckFiltersForQueryString(filters))

        filters.forSale = true
        filters.forTrade = true
        const decksForSaleLink = Routes.deckSearch(prepareDeckFiltersForQueryString(filters))

        const forSaleQueries = forSaleNotificationsStore.queries

        return (
            <div style={{margin: spacing(2), marginTop: spacing(4), display: "flex", justifyContent: "center"}}>
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
                <Grid container={true} spacing={16} justify={"center"}>
                    <Grid item={true}>
                        <form onSubmit={this.updateProfile}>
                            <KeyCard
                                topContents={(
                                    <div>
                                        <Typography variant={"h4"} style={{color: "#FFFFFF"}}>{profile.username}</Typography>
                                    </div>
                                )}
                                style={{maxWidth: 400, margin: 0}}
                            >
                                <div style={{padding: spacing(2)}}>
                                    <Grid container={true} spacing={16}>
                                        <Grid item={true} xs={12}>
                                            <TextField
                                                label={"email"}
                                                value={this.email}
                                                onChange={(event) => this.email = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                                style={{marginBottom: spacing(2)}}
                                            />
                                        </Grid>
                                        <Grid item={true} xs={12}>
                                            <TextField
                                                label={"Public contact and trade info"}
                                                value={this.contactInfo}
                                                multiline={true}
                                                rows={4}
                                                onChange={(event) => this.contactInfo = event.target.value}
                                                fullWidth={true}
                                                variant={"outlined"}
                                                style={{marginBottom: spacing(2)}}
                                            />
                                        </Grid>
                                        <Grid item={true} xs={12} sm={6}>
                                            <TextField
                                                select
                                                label="Country"
                                                value={this.country}
                                                onChange={event => this.country = event.target.value}
                                                variant="outlined"
                                                fullWidth={true}
                                                style={{marginBottom: spacing(2)}}
                                            >
                                                {countries.map(country => (
                                                    <MenuItem key={country} value={country}>
                                                        {countryToLabel(country)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item={true} xs={12}>
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
                                                    onChange={(event: any) => this.preferredCountries = event.target.value}
                                                    input={
                                                        <OutlinedInput
                                                            labelWidth={this.preferredCountriesLabelWidth}
                                                            id={"buying-countries-input-id"}
                                                            fullWidth={true}
                                                        />
                                                    }
                                                    renderValue={(selected: any) => selected.join(", ")}
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
                                                Select countries to be used when searching decks for sale. Defaults to your country.
                                            </FormHelperText>
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
                                                label={"Allow anyone to see which decks I own"}
                                            />
                                            <Typography style={{marginBottom: spacing(2), marginTop: spacing(2)}}>
                                                Use the links below to share your decks with other users. You can also share the URL of any search you make.
                                            </Typography>
                                            <div style={{display: "flex"}}>
                                                {this.allowUsersToSeeDeckOwnership ? (
                                                    <LinkButton color={"primary"} to={decksLink} style={{marginRight: spacing(2)}}>
                                                        My Decks
                                                    </LinkButton>
                                                ) : null}
                                                <LinkButton color={"primary"} to={decksForSaleLink}>
                                                    For Sale and Trade
                                                </LinkButton>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <CardActions
                                        style={{paddingLeft: 0}}
                                    >
                                        <div style={{flexGrow: 1}}/>
                                        <Button
                                            variant={"contained"}
                                            type={"submit"}
                                        >
                                            Save
                                        </Button>
                                    </CardActions>
                                </div>
                            </KeyCard>
                        </form>
                    </Grid>
                    {forSaleQueries && forSaleQueries.length > 0 ? (
                        <Grid item={true}>
                            <ForSaleQueryTable queries={forSaleQueries}/>
                        </Grid>
                    ) : null}
                </Grid>
            </div>
        )
    }
}
