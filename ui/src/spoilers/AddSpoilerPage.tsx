import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, prettyJson, Utils } from "../config/Utils"
import { Expansion } from "../expansions/Expansions"
import { EventValue } from "../generic/EventValue"
import { House } from "../houses/House"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { messageStore } from "../ui/MessageStore"
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

let defaultHouse: "" | House = ""
let defaultCardType: "" | CardType = ""

@observer
class AddSpoiler extends React.Component<AddSpoilerProps> {

    @observable
    cardTitle = ""
    @observable
    house: "" | House = defaultHouse
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
    rarity: "" | Rarity = Rarity.Common
    @observable
    cardNumber = ""
    @observable
    frontImage = ""

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
        log.debug(`Reset spoiler add page with ${prettyJson(spoiler)}`)
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
        } else {
            this.cardTitle = ""
            this.house = defaultHouse
            this.cardType = defaultCardType
            this.cardText = ""
            this.amber = "0"
            this.power = ""
            this.armor = ""
            this.rarity = Rarity.Common
            this.cardNumber = ""
            this.frontImage = ""
            this.spoilerId = undefined
        }
    }

    save = async () => {
        const cardTitle = this.cardTitle.trim()
        if (cardTitle.length < 1) {
            messageStore.setWarningMessage("Please include a card title.")
            return
        }
        const house = this.house as House
        if (house.length < 1) {
            messageStore.setWarningMessage("Please include house.")
            return
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
            cardNumber: this.cardNumber.trim().padStart(3, "0"),
            active: true,
            frontImage: this.frontImage,
            id: this.spoilerId
        }
        await spoilerStore.saveSpoiler(spoiler)
        spoilerStore.loadAllSpoilers()
        this.reset()
    }

    render() {

        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <Card style={{maxWidth: 800, margin: spacing(4), padding: spacing(2)}}>
                    <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>
                        {this.spoilerId == null ? "Create" : "Edit"} Spoiler Card
                    </Typography>
                    <Grid container={true} spacing={2}>
                        <Grid item={true} xs={12} md={8}>
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
                        <Grid item={true} xs={12} md={4}>
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
                        <Grid item={true} xs={12} sm={4}>
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
                        <Grid item={true} xs={12} sm={4}>
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
                        <Grid item={true} xs={12} sm={4}>
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
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                label={"aember"}
                                value={this.amber}
                                onChange={(event: EventValue) => this.amber = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                                type={"number"}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                label={"power"}
                                value={this.power}
                                onChange={(event: EventValue) => this.power = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                                type={"number"}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
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
                    <div style={{marginTop: spacing(2), display: "flex"}}>
                        <LinkButton
                            to={Routes.spoilers}
                            style={{marginRight: spacing(2)}}
                        >
                            Spoilers
                        </LinkButton>
                        <div style={{flexGrow: this.spoilerId == null ? 1 : undefined}}/>
                        {this.spoilerId != null && (
                            <>
                                <LinkButton
                                    to={Routes.createSpoiler}
                                    style={{marginRight: spacing(2)}}
                                >
                                    Make new Spoiler
                                </LinkButton>
                                <div style={{flexGrow: 1}}/>
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