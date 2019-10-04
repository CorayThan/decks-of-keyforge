import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, Utils } from "../config/Utils"
import { Expansion } from "../expansions/Expansions"
import { EventValue } from "../generic/EventValue"
import { House } from "../houses/House"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { addRealSpaces, addUrlsToCards, makeOldCards, makeSpoilers } from "./SanctumoniusCards"
import { Spoiler } from "./Spoiler"
import { spoilerStore } from "./SpoilerStore"

interface EditSpoilerPageProps extends RouteComponentProps<{ spoilerId: string }> {
}

@observer
export class EditSpoilerPage extends React.Component<EditSpoilerPageProps> {

    componentDidMount(): void {
        log.debug("component did mount spoilerId: " + this.props.match.params.spoilerId)
        if (this.props.match.params.spoilerId) {
            spoilerStore.findSpoiler(Number(this.props.match.params.spoilerId))
        }
    }

    componentWillReceiveProps(nextProps: EditSpoilerPageProps): void {
        log.debug("component will receive spoilerId: " + this.props.match.params.spoilerId + " next: " + nextProps.match.params.spoilerId)
        if (this.props.match.params.spoilerId && this.props.match.params.spoilerId != nextProps.match.params.spoilerId) {
            spoilerStore.findSpoiler(Number(nextProps.match.params.spoilerId))
        }
    }

    render() {
        const spoiler = spoilerStore.spoiler
        if (spoiler == null) {
            return <Loader/>
        }
        return <AddSpoiler spoiler={spoiler}/>
    }
}

@observer
export class AddSpoilerPage extends React.Component {

    componentDidMount(): void {
        spoilerStore.loadAllSpoilers()
    }

    render() {
        return <AddSpoiler/>
    }
}

interface AddSpoilerProps {
    spoiler?: Spoiler
}

let defaultHouse: "" | House | undefined = ""
let defaultCardType: "" | CardType = ""
let defaultCardRarity: "" | Rarity = Rarity.Common

@observer
class AddSpoiler extends React.Component<AddSpoilerProps> {

    @observable
    cardTitle = ""
    @observable
    house?: "" | House = defaultHouse
    @observable
    cardType: "" | CardType = defaultCardType
    @observable
    cardText = ""
    @observable
    amber = "0"
    @observable
    power = ""
    @observable
    armor = ""
    @observable
    rarity: "" | Rarity = defaultCardRarity
    @observable
    cardNumber = ""
    @observable
    frontImage = ""

    @observable
    amberControl = "0"
    @observable
    expectedAmber = "0"
    @observable
    artifactControl = "0"
    @observable
    creatureControl = "0"
    @observable
    aercScore = "0"
    @observable
    efficiency = "0"
    @observable
    effectivePower = "0"
    @observable
    amberProtection = "0"
    @observable
    disruption = "0"
    @observable
    houseCheating = "0"
    @observable
    other = "0"

    spoilerId?: number

    componentDidMount(): void {
        this.reset()
    }

    componentWillReceiveProps(nextProps: Readonly<AddSpoilerProps>) {
        if (this.props.spoiler !== nextProps.spoiler) {
            this.reset()
        }
    }

    reset = () => {
        const {spoiler} = this.props
        if (spoiler != null) {
            this.cardTitle = spoiler.cardTitle
            this.house = spoiler.house
            this.cardType = spoiler.cardType
            this.cardText = spoiler.cardText
            this.amber = spoiler.amber.toString()
            this.power = spoiler.powerString
            this.armor = spoiler.armorString
            this.rarity = spoiler.rarity
            this.cardNumber = spoiler.cardNumber
            this.frontImage = spoiler.frontImage
            this.spoilerId = spoiler.id

            this.amberControl = spoiler.amberControl.toString()
            this.expectedAmber = spoiler.expectedAmber.toString()
            this.artifactControl = spoiler.artifactControl.toString()
            this.creatureControl = spoiler.creatureControl.toString()
            this.efficiency = spoiler.efficiency.toString()
            this.effectivePower = spoiler.effectivePower.toString()
            this.amberProtection = spoiler.amberProtection.toString()
            this.disruption = spoiler.disruption.toString()
            this.houseCheating = spoiler.houseCheating.toString()
            this.other = spoiler.other.toString()
        } else {
            this.cardTitle = ""
            this.house = defaultHouse
            this.cardType = defaultCardType
            this.cardText = ""
            this.amber = "0"
            this.power = ""
            this.armor = ""
            this.rarity = defaultCardRarity
            this.cardNumber = ""
            this.frontImage = ""
            this.spoilerId = undefined

            this.amberControl = "0"
            this.expectedAmber = "0"
            this.artifactControl = "0"
            this.creatureControl = "0"
            this.efficiency = "0"
            this.effectivePower = "0"
            this.amberProtection = "0"
            this.disruption = "0"
            this.houseCheating = "0"
            this.other = "0"
        }
    }

    save = async () => {
        const cardTitle = this.cardTitle.trim()
        if (cardTitle.length < 1) {
            messageStore.setWarningMessage("Please include a card title.")
            return
        }
        let house = this.house as House | undefined
        if (house != null && house.length < 1) {
            house = undefined
        }
        const cardType = this.cardType as CardType
        if (cardType.length < 1) {
            messageStore.setWarningMessage("Please include card type.")
            return
        }
        const rarity = this.rarity as Rarity
        if (rarity.length < 1) {
            messageStore.setWarningMessage("Please include rarity.")
            return
        }
        defaultHouse = house
        defaultCardType = cardType
        defaultCardRarity = rarity

        let effectivePower = Number(this.effectivePower)
        if (effectivePower === 0) {
            effectivePower = Number(this.power) + Number(this.armor)
        }
        let expectedAmber = Number(this.expectedAmber)
        if (expectedAmber === 0) {
            expectedAmber = Number(this.amber)
        }

        const spoiler: Spoiler = {
            cardType,
            cardTitle,
            rarity,
            house,
            expansion: Expansion.WC,
            amber: this.amber === "" ? 0 : Number(this.amber),
            powerString: this.power,
            armorString: this.armor,
            cardText: this.cardText.trim(),
            cardNumber: this.cardNumber.trim(),
            active: true,
            frontImage: this.frontImage,
            id: this.spoilerId,

            amberControl: Number(this.amberControl),
            expectedAmber,
            artifactControl: Number(this.artifactControl),
            creatureControl: Number(this.creatureControl),
            efficiency: Number(this.efficiency),
            effectivePower,
            amberProtection: Number(this.amberProtection),
            disruption: Number(this.disruption),
            houseCheating: Number(this.houseCheating),
            other: Number(this.other),

            aercScore: 0,
            anomaly: false,
            reprint: false
        }
        await spoilerStore.saveSpoiler(spoiler)
        spoilerStore.loadAllSpoilers()
        this.reset()
    }

    render() {

        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div>
                    <Card style={{maxWidth: 800, margin: spacing(4), padding: spacing(2)}}>
                        <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>
                            {this.spoilerId == null ? "Create" : "Edit"} Spoiler Card
                        </Typography>
                        <Grid container={true} spacing={2}>
                            <Grid item={true} xs={8}>
                                <TextField
                                    label={"name"}
                                    value={this.cardTitle}
                                    onChange={(event: EventValue) => this.cardTitle = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    error={this.spoilerId == null && spoilerStore.containsNameIgnoreCase(this.cardTitle)}
                                    autoFocus={true}
                                />
                            </Grid>
                            <Grid item={true} xs={4}>
                                <TextField
                                    label={"number"}
                                    value={this.cardNumber}
                                    onChange={(event: EventValue) => this.cardNumber = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                    error={this.spoilerId == null && spoilerStore.containsCardNumberIgnoreCase(this.cardNumber)}
                                />
                            </Grid>
                            <Grid item={true} xs={4}>
                                <TextField
                                    select={true}
                                    label={"house"}
                                    value={this.house}
                                    onChange={(event: EventValue) => this.house = event.target.value as House}
                                    variant={"outlined"}
                                    fullWidth={true}
                                >
                                    {Utils.enumValues(House).map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={4}>
                                <TextField
                                    select={true}
                                    label={"type"}
                                    value={this.cardType}
                                    onChange={(event: EventValue) => this.cardType = event.target.value as CardType}
                                    variant={"outlined"}
                                    fullWidth={true}
                                >
                                    {Utils.enumValues(CardType).map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={4}>
                                <TextField
                                    select={true}
                                    label={"rarity"}
                                    value={this.rarity}
                                    onChange={(event: EventValue) => this.rarity = event.target.value as Rarity}
                                    variant={"outlined"}
                                    fullWidth={true}
                                >
                                    {Utils.enumValues(Rarity).map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={4}>
                                <TextField
                                    label={"aember"}
                                    value={this.amber}
                                    onChange={(event: EventValue) => this.amber = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={4}>
                                <TextField
                                    label={"power"}
                                    value={this.power}
                                    onChange={(event: EventValue) => this.power = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={4}>
                                <TextField
                                    label={"armor"}
                                    value={this.armor}
                                    onChange={(event: EventValue) => this.armor = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={12}>
                                <TextField
                                    label={"text"}
                                    value={this.cardText}
                                    onChange={(event: EventValue) => this.cardText = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    multiline={true}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            spacing={2}
                            style={{display: userStore.isAdmin ? undefined : "none", marginTop: spacing(2)}}
                        >
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"expected aember"}
                                    value={this.expectedAmber}
                                    onChange={(event: EventValue) => this.expectedAmber = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"aember control"}
                                    value={this.amberControl}
                                    onChange={(event: EventValue) => this.amberControl = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"artifact control"}
                                    value={this.artifactControl}
                                    onChange={(event: EventValue) => this.artifactControl = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"creature control"}
                                    value={this.creatureControl}
                                    onChange={(event: EventValue) => this.creatureControl = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"efficiency"}
                                    value={this.efficiency}
                                    onChange={(event: EventValue) => this.efficiency = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"disruption"}
                                    value={this.disruption}
                                    onChange={(event: EventValue) => this.disruption = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"effective power"}
                                    value={this.effectivePower}
                                    onChange={(event: EventValue) => this.effectivePower = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"aember protection"}
                                    value={this.amberProtection}
                                    onChange={(event: EventValue) => this.amberProtection = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"house cheating"}
                                    value={this.houseCheating}
                                    onChange={(event: EventValue) => this.houseCheating = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={3}>
                                <TextField
                                    label={"other"}
                                    value={this.other}
                                    onChange={(event: EventValue) => this.other = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                        </Grid>
                        <div style={{marginTop: spacing(2), display: "flex"}}>
                            <LinkButton
                                to={Routes.spoilers}
                                style={{marginRight: spacing(2)}}
                            >
                                Spoilers
                            </LinkButton>
                            <LinkButton
                                to={Routes.createSpoiler}
                                style={{marginRight: spacing(2)}}
                            >
                                {this.spoilerId == null ? "Reset" : "Make new Spoiler"}
                            </LinkButton>
                            <div style={{flexGrow: 1}}/>
                            {this.spoilerId != null && (
                                <>
                                    <AddImage spoilerId={this.spoilerId}/>
                                    <Button
                                        color={"secondary"}
                                        variant={"contained"}
                                        onClick={async () => {
                                            await spoilerStore.deleteSpoiler(this.spoilerId!)
                                        }}
                                        style={{marginRight: spacing(2)}}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                            <KeyButton
                                variant={"contained"}
                                color={"primary"}
                                loading={spoilerStore.savingSpoiler}
                                onClick={this.save}
                            >
                                Save
                            </KeyButton>
                        </div>
                    </Card>

                    {userStore.isAdmin && (
                        <Button
                            onClick={async () => {
                                const preexisting = spoilerStore.allSpoilers
                                if (preexisting.length !== 0) {
                                    const sanctumonius = makeSpoilers(preexisting)
                                    for (let x = 0; x < sanctumonius.length; x++) {
                                        const spoiler = sanctumonius[x]
                                        await spoilerStore.saveSpoiler(spoiler as Spoiler)
                                        log.debug("Saved " + spoiler.cardTitle)
                                    }
                                    log.debug(`Saved ${sanctumonius.length} new spoilers.`)
                                    const withUrls = addUrlsToCards(preexisting)
                                    for (let x = 0; x < withUrls.length; x++) {
                                        const spoiler = withUrls[x]
                                        await spoilerStore.saveSpoiler(spoiler)
                                        log.debug("Added url to " + spoiler.cardTitle)
                                    }
                                    log.debug(`Added urls to ${withUrls.length} spoilers.`)

                                    const oldCards = makeOldCards(preexisting)
                                    for (let x = 0; x < oldCards.length; x++) {
                                        const spoiler = oldCards[x]
                                        await spoilerStore.saveSpoiler(spoiler as Spoiler)
                                        log.debug("Added reprint " + spoiler.cardTitle)
                                    }
                                    log.debug(`Added ${oldCards.length} reprints.`)

                                    await addRealSpaces()
                                } else {
                                    log.debug("Did nothing")
                                }
                            }}
                        >
                            Add all the sanctumonius cards
                        </Button>
                    )}
                </div>
            </div>
        )
    }
}

@observer
class AddImage extends React.Component<{ spoilerId: number }> {

    @observable
    open = false

    addSpoilerImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await spoilerStore.addImageToSpoiler(event.target.files![0], this.props.spoilerId)
        this.open = false
    }

    render() {
        return (
            <div>
                <Button variant={"outlined"} onClick={() => this.open = true} style={{marginRight: spacing(2)}}>
                    Add Image
                </Button>
                <Dialog
                    open={this.open}
                    onClose={() => this.open = false}
                >
                    <DialogTitle>Add Image</DialogTitle>
                    <DialogContent>
                        <Typography variant={"subtitle1"} color={"error"}>Please read and follow these directions!</Typography>
                        <Typography style={{marginTop: spacing(1)}}>Dimensions should be 300px by 420px. Less is fine, but exactly that is best.</Typography>
                        <Typography style={{marginTop: spacing(1)}}>
                            Image should be a jpg or png. Image size should be less than 250kb. 100kb or less is best.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <input
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            style={{display: "none"}}
                            onChange={this.addSpoilerImage}
                        />
                        <label htmlFor="contained-button-file">
                            <KeyButton
                                component={"span"}
                                variant="contained"
                                color={"primary"}
                                loading={spoilerStore.addingSpoilerImage}
                            >
                                Upload Image
                            </KeyButton>
                        </label>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}