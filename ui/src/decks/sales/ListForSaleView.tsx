import { Dialog, Typography } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { differenceInDays, parse } from "date-fns"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { MessageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { DeckCondition, deckConditionReadableValue } from "../../userdeck/UserDeck"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { Deck } from "../Deck"

interface ListForSaleViewProps {
    deck: Deck
}

@observer
export class ListForSaleView extends React.Component<ListForSaleViewProps> {

    @observable
    open = false

    @observable
    forSale = true
    @observable
    forTrade = true
    @observable
    condition = DeckCondition.NEW_IN_PLASTIC
    @observable
    askingPrice = ""
    @observable
    listingInfo = ""
    @observable
    externalLink = ""
    @observable
    expireInDays = "7"

    @observable
    preExistingDays = ""

    @observable
    update = false

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
        this.forSale = true
        this.forTrade = true
        this.condition = DeckCondition.NEW_IN_PLASTIC
        this.askingPrice = ""
        this.listingInfo = ""
        this.externalLink = ""
        this.update = false
    }

    handleOpenForEdit = () => {
        const userDeck = userDeckStore.userDeckByDeckId(this.props.deck.id)
        if (userDeck != null) {
            const {forSale, forTrade, condition, askingPrice, listingInfo, externalLink, expiresAtLocalDate} = userDeck
            this.open = true
            this.update = true
            this.forSale = forSale
            this.forTrade = forTrade
            this.condition = condition ? condition : DeckCondition.NEW_IN_PLASTIC
            this.askingPrice = askingPrice ? askingPrice.toString() : ""
            this.listingInfo = listingInfo ? listingInfo : ""
            this.externalLink = externalLink ? externalLink : ""

            if (expiresAtLocalDate == null) {
                this.expireInDays = "365"
            } else {
                const expiresDate = parse(expiresAtLocalDate)
                this.expireInDays = differenceInDays(expiresDate, new Date()).toString()
                this.preExistingDays = this.expireInDays
            }
        }
    }

    list = () => {
        const {forSale, forTrade, condition, askingPrice, listingInfo, externalLink, expireInDays} = this
        if (!forSale && !forTrade) {
            MessageStore.instance.setWarningMessage("The deck must be listed for sale or trade.")
            return
        }
        if (listingInfo.length > 2000) {
            MessageStore.instance.setWarningMessage("The listing info must be less than 2000 characters long.")
            return
        }
        let askingPriceNumber
        if (askingPrice.length > 0) {
            askingPriceNumber = Number(askingPrice)
            if (isNaN(askingPriceNumber)) {
                MessageStore.instance.setWarningMessage("The asking price must be a number.")
                return
            }
        }
        const forSaleInCountry = userStore.country

        if (!forSaleInCountry) {
            MessageStore.instance.setWarningMessage("Please set your country in your user profile.")
            return
        }

        const listingInfoDto = {
            deckId: this.props.deck.id,
            forSale,
            forTrade,
            forSaleInCountry,
            condition,
            askingPrice: askingPriceNumber,
            listingInfo,
            externalLink,
            expireInDays: Number(expireInDays)
        }
        userDeckStore.listDeck(this.props.deck.name, listingInfoDto)
        this.handleClose()
    }

    render() {
        const deck = this.props.deck
        const userDeck = userDeckStore.userDeckByDeckId(deck.id)
        let saleButton
        if (userDeck && (userDeck.forSale || userDeck.forTrade)) {
            saleButton = (
                <>
                    <KeyButton
                        color={"primary"}
                        onClick={this.handleOpenForEdit}
                        style={{marginRight: spacing(1)}}
                    >
                        Edit Listing
                    </KeyButton>
                    <KeyButton
                        color={"primary"}
                        onClick={() => userDeckStore.unlist(deck.name, deck.id)}
                    >
                        Unlist
                    </KeyButton>
                </>
            )
        } else {
            saleButton = (
                <KeyButton
                    color={"primary"}
                    onClick={this.handleOpen}
                >
                    Sell
                </KeyButton>
            )
        }

        const forSaleInCountry = userStore.country

        return (
            <div>
                {saleButton}
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        {this.update ? (
                            `Update listing for "${deck.name}"`
                        ) : (
                            `List "${deck.name}" for sale or trade`
                        )}
                    </DialogTitle>
                    <DialogContent>
                        {forSaleInCountry ? null : (
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Typography variant={"subtitle2"} color={"error"} style={{marginRight: spacing(2)}}>
                                    Please choose your country on your profile to list decks.
                                </Typography>
                                <LinkButton
                                    to={Routes.myProfile}
                                >
                                    Profile
                                </LinkButton>
                            </div>
                        )}
                        <FormGroup row={true}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.forSale}
                                        onChange={(event) => {
                                            this.forSale = event.target.checked
                                            if (!this.forSale) {
                                                this.askingPrice = ""
                                            }
                                        }}
                                        color={"primary"}
                                    />
                                }
                                label={"For sale"}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.forTrade}
                                        onChange={(event) => this.forTrade = event.target.checked}
                                        color={"primary"}
                                    />
                                }
                                label={"For trade"}
                            />
                        </FormGroup>
                        <TextField
                            select={true}
                            label={"Expires In"}
                            value={this.expireInDays}
                            onChange={(event) => this.expireInDays = event.target.value}
                            style={{marginRight: spacing(2)}}
                        >
                            <MenuItem value={"3"}>
                                3 days
                            </MenuItem>
                            <MenuItem value={"7"}>
                                7 days
                            </MenuItem>
                            <MenuItem value={"10"}>
                                10 days
                            </MenuItem>
                            <MenuItem value={"30"}>
                                30 days
                            </MenuItem>
                            <MenuItem value={"365"}>
                                One year
                            </MenuItem>
                            {this.preExistingDays ? (
                                <MenuItem value={this.preExistingDays}>
                                    {this.preExistingDays} days
                                </MenuItem>
                            ) : null}
                        </TextField>
                        <TextField
                            select={true}
                            label={"Condition"}
                            value={this.condition}
                            onChange={(event) => this.condition = event.target.value as DeckCondition}
                            style={{marginRight: spacing(2)}}
                        >
                            {Utils.enumValues(DeckCondition).map(condition => {
                                return (
                                    <MenuItem key={condition} value={condition}>
                                        {deckConditionReadableValue(condition as DeckCondition)}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                        <TextField
                            label={"Asking price"}
                            type={"number"}
                            value={this.askingPrice}
                            onChange={(event) => this.askingPrice = event.target.value}
                            style={{visibility: this.forSale ? "visible" : "hidden"}}
                        />
                        <TextField
                            label={"External listing link"}
                            value={this.externalLink}
                            onChange={(event) => this.externalLink = event.target.value}
                            fullWidth={true}
                            helperText={"Ebay link, store link, etc."}
                            style={{marginTop: spacing(2)}}
                        />
                        <TextField
                            label={"Listing Info"}
                            value={this.listingInfo}
                            onChange={(event) => this.listingInfo = event.target.value}
                            multiline={true}
                            fullWidth={true}
                            helperText={"Trade requests, detailed condition info, etc."}
                            style={{marginTop: spacing(2)}}
                        />
                        <div style={{display: "flex", alignItems: "center", marginTop: spacing(2)}}>
                            <Typography>
                                Add generic info for all decks listings on your
                            </Typography>
                            <LinkButton
                                to={Routes.myProfile}
                                style={{margin: spacing(1)}}
                            >
                                Profile
                            </LinkButton>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Cancel</KeyButton>
                        <KeyButton color={"primary"} onClick={this.list} disabled={!forSaleInCountry}>
                            {this.update ? "Update Listing" : "List"}
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
