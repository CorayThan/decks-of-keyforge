import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@material-ui/core"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, Utils } from "../config/Utils"
import { Expansion } from "../expansions/Expansions"
import { EventValue } from "../generic/EventValue"
import { UnstyledLink } from "../generic/UnstyledLink"
import { House } from "../houses/House"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { messageStore } from "../ui/MessageStore"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { userStore } from "../user/UserStore"
import { Spoiler } from "./Spoiler"
import { spoilerStore } from "./SpoilerStore"
import { SpoilerImage } from "./SpoilerView"

interface EditSpoilerPageProps extends RouteComponentProps<{ spoilerId: string }> {
}

@observer
export class EditSpoilerPage extends React.Component<EditSpoilerPageProps> {

    componentDidMount(): void {
        log.debug("component did mount spoilerId: " + this.props.match.params.spoilerId)
        if (spoilerStore.allSpoilers.length === 0) {
            spoilerStore.loadAllSpoilers()
        }
        if (this.props.match.params.spoilerId) {
            spoilerStore.findSpoiler(Number(this.props.match.params.spoilerId))
        }
    }

    componentDidUpdate(prevProps: EditSpoilerPageProps): void {
        if (prevProps.match.params.spoilerId && prevProps.match.params.spoilerId != this.props.match.params.spoilerId) {
            spoilerStore.findSpoiler(Number(this.props.match.params.spoilerId))
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
    traits = ""

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
    @observable
    reprint = false
    @observable
    anomaly = false
    @observable
    doubleCard = false

    spoilerId?: number

    componentDidMount(): void {
        this.reset()
    }

    componentDidUpdate(prevProps: Readonly<AddSpoilerProps>) {
        if (prevProps.spoiler !== this.props.spoiler) {
            this.reset()
        }
    }

    reset = (resetTo?: Spoiler) => {
        const spoiler = resetTo == null ? this.props.spoiler : resetTo
        if (spoiler != null) {
            this.cardTitle = spoiler.cardTitle
            this.house = spoiler.house == null ? "" : spoiler.house
            this.cardType = spoiler.cardType
            this.cardText = spoiler.cardText
            this.amber = spoiler.amber.toString()
            this.power = spoiler.powerString
            this.armor = spoiler.armorString
            this.rarity = spoiler.rarity == null ? "" : spoiler.rarity
            this.cardNumber = spoiler.cardNumber
            this.frontImage = spoiler.frontImage
            this.reprint = spoiler.reprint
            this.anomaly = spoiler.anomaly
            this.doubleCard = spoiler.doubleCard
            this.spoilerId = spoiler.id
            this.traits = spoiler.traits

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

            uiStore.setTopbarValues("Edit " + this.cardTitle, "Edit", "")
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
            this.reprint = false
            this.anomaly = false
            this.doubleCard = false
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

            uiStore.setTopbarValues("New Spoiler", "New", "")
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
        const rarity = this.rarity === "" ? undefined : this.rarity
        defaultHouse = house
        defaultCardType = cardType
        if (rarity != null) {
            defaultCardRarity = rarity
        }

        let effectivePower = Number(this.effectivePower)
        if (effectivePower === 0) {
            effectivePower = Number(this.power) + Number(this.armor)
        }
        let expectedAmber = Number(this.expectedAmber)
        if (expectedAmber === 0) {
            expectedAmber = Number(this.amber)
        }
        const traits = this.traits.trim().toUpperCase()
        if (!traits.match(/^(\w|,)*$/)) {
            messageStore.setWarningMessage(`Please ensure traits are a comma separated list, for example "GIANT,KNIGHT"`)
            return
        }

        const spoiler: Spoiler = {
            cardType,
            cardTitle,
            rarity,
            house,
            traits,
            expansion: Expansion.MM,
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
            anomaly: this.anomaly,
            reprint: this.reprint,
            doubleCard: this.doubleCard,

            createdById: userStore.userId!
        }
        await spoilerStore.saveSpoiler(spoiler)
        if (this.spoilerId != null) {
            const saved = await spoilerStore.findSpoiler(this.spoilerId)
            this.reset(saved)
        } else {
            this.reset()
        }
        spoilerStore.loadAllSpoilers()
    }

    render() {
        const allSpoilers = spoilerStore.allSpoilers
        let nextId
        let prevId
        if (allSpoilers.length > 0 && this.props.spoiler != null) {
            const findWith = allSpoilers.find(spoiler => spoiler.id === this.spoilerId)
            if (findWith != null) {
                const idx = allSpoilers.indexOf(findWith)
                nextId = idx > -1 && idx < allSpoilers.length - 1 ? allSpoilers[idx + 1].id : undefined
                prevId = idx > 0 ? allSpoilers[idx - 1].id : undefined
            }
        }
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: screenStore.screenSizeMdPlus() ? undefined : "column"
                }}
            >
                {this.frontImage && <SpoilerImage cardTitle={this.cardTitle} url={this.frontImage}/>}
                <div>
                    <Card style={{maxWidth: 800, margin: spacing(4), padding: spacing(2)}}>
                        <div style={{display: "flex", alignItems: "center", marginBottom: spacing(2)}}>
                            <Typography variant={"h4"}>
                                {this.spoilerId == null ? "Create" : "Edit"} Spoiler Card
                            </Typography>
                            <div style={{flexGrow: 1}}/>
                            {prevId != null && (
                                <UnstyledLink to={Routes.editSpoiler(prevId)} style={{marginLeft: spacing(2)}}>
                                    <IconButton>
                                        <ChevronLeft/>
                                    </IconButton>
                                </UnstyledLink>
                            )}
                            {nextId != null && (
                                <UnstyledLink to={Routes.editSpoiler(nextId)} style={{marginLeft: spacing(2)}}>
                                    <IconButton>
                                        <ChevronRight/>
                                    </IconButton>
                                </UnstyledLink>
                            )}
                        </div>
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
                                    onChange={(event: EventValue) => this.rarity = event.target.value as (Rarity | "")}
                                    variant={"outlined"}
                                    fullWidth={true}
                                >
                                    <MenuItem value={""}>
                                        Unknown
                                    </MenuItem>
                                    {Utils.enumValues(Rarity).map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={4} sm={2}>
                                <TextField
                                    label={"aember"}
                                    value={this.amber}
                                    onChange={(event: EventValue) => this.amber = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={4} sm={2}>
                                <TextField
                                    label={"power"}
                                    value={this.power}
                                    onChange={(event: EventValue) => this.power = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={4} sm={2}>
                                <TextField
                                    label={"armor"}
                                    value={this.armor}
                                    onChange={(event: EventValue) => this.armor = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </Grid>
                            <Grid item={true} xs={4} sm={2}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.reprint}
                                            onChange={() => this.reprint = !this.reprint}
                                            color="primary"
                                        />
                                    }
                                    label="Reprint"
                                />
                            </Grid>
                            <Grid item={true} xs={4} sm={2}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.anomaly}
                                            onChange={() => this.anomaly = !this.anomaly}
                                            color="primary"
                                        />
                                    }
                                    label="Anomaly"
                                />
                            </Grid>
                            <Grid item={true} xs={4} sm={2}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.doubleCard}
                                            onChange={() => this.doubleCard = !this.doubleCard}
                                            color="primary"
                                        />
                                    }
                                    label="Double Card"
                                />
                            </Grid>
                            <Grid item={true} xs={6}>
                                <TextField
                                    label={"traits"}
                                    value={this.traits}
                                    onChange={(event: EventValue) => this.traits = event.target.value}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    multiline={true}
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
                                disabled={!keyLocalStorage.genericStorage.agreedToSpoilerCreatureRules}
                            >
                                Save
                            </KeyButton>
                        </div>
                    </Card>

                    {/*{userStore.isAdmin && (*/}
                    {/*    <Button*/}
                    {/*        onClick={async () => {*/}
                    {/*            const preexisting = spoilerStore.allSpoilers*/}
                    {/*            if (preexisting.length !== 0) {*/}
                    {/*                const sanctumonius = makeSpoilers(preexisting)*/}
                    {/*                for (let x = 0; x < sanctumonius.length; x++) {*/}
                    {/*                    const spoiler = sanctumonius[x]*/}
                    {/*                    await spoilerStore.saveSpoiler(spoiler as Spoiler)*/}
                    {/*                    log.debug("Saved " + spoiler.cardTitle)*/}
                    {/*                }*/}
                    {/*                log.debug(`Saved ${sanctumonius.length} new spoilers.`)*/}
                    {/*                const withUrls = addUrlsToCards(preexisting)*/}
                    {/*                for (let x = 0; x < withUrls.length; x++) {*/}
                    {/*                    const spoiler = withUrls[x]*/}
                    {/*                    await spoilerStore.saveSpoiler(spoiler)*/}
                    {/*                    log.debug("Added url to " + spoiler.cardTitle)*/}
                    {/*                }*/}
                    {/*                log.debug(`Added urls to ${withUrls.length} spoilers.`)*/}

                    {/*                const oldCards = makeOldCards(preexisting)*/}
                    {/*                for (let x = 0; x < oldCards.length; x++) {*/}
                    {/*                    const spoiler = oldCards[x]*/}
                    {/*                    await spoilerStore.saveSpoiler(spoiler as Spoiler)*/}
                    {/*                    log.debug("Added reprint " + spoiler.cardTitle)*/}
                    {/*                }*/}
                    {/*                log.debug(`Added ${oldCards.length} reprints.`)*/}

                    {/*                await addRealSpaces()*/}
                    {/*            } else {*/}
                    {/*                log.debug("Did nothing")*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        Add all the sanctumonius cards*/}
                    {/*    </Button>*/}
                    {/*)}*/}
                </div>
                <div>
                    <Card style={{maxWidth: 400}}>
                        <CardContent>
                            <Typography variant={"h5"} style={{marginBottom: spacing(2)}}>Spoiler Creation Instructions and Requirements</Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"subtitle1"}>
                                Instructions
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"body2"}>
                                Aember values should be entered as "A", for example: "1 A". When a card's text is incomplete, enter "???"
                                where text is partially unknown.
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"body2"}>
                                Enter double-cards only once, using the bottom, or top and bottom, cards for the image.
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"body2"}>
                                After saving the text of the card, you can edit that card to add the card image.
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"subtitle1"}>
                                Requirements
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"body2"}>
                                The information I enter is a faithful representation of the text of the KeyForge card.
                                If you are not sure what the text reads, only enter as much of the text as can be read.
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"body2"}>
                                I have the right to share this card text and image. By sharing it publicly, I am not violating any legally binding agreements.
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"body2"}>
                                I give Decks of KeyForge the license in perpetuity to freely use and display the contents I have created in any way.
                            </Typography>
                            <Typography style={{marginBottom: spacing(2)}} variant={"body2"}>
                                I will receive no compensation.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <div style={{flexGrow: 1}}/>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={keyLocalStorage.genericStorage.agreedToSpoilerCreatureRules}
                                        onChange={() => keyLocalStorage.updateGenericStorage({agreedToSpoilerCreatureRules: !keyLocalStorage.genericStorage.agreedToSpoilerCreatureRules})}
                                        color="primary"
                                    />
                                }
                                label="I agree to the requirements"
                                disabled={keyLocalStorage.genericStorage.agreedToSpoilerCreatureRules}
                            />
                        </CardActions>
                    </Card>
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