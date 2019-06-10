import { Dialog, Typography } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { differenceInDays, format } from "date-fns"
import { startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { auctionStore } from "../../auctions/AuctionStore"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { PatronButton } from "../../patreon/PatronButton"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { ListingInfo } from "../../userdeck/ListingInfo"
import { DeckCondition, deckConditionReadableValue } from "../../userdeck/UserDeck"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { Deck } from "../Deck"
import { DeckLanguage } from "../DeckLanguage"

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
    auction = false
    @observable
    condition = DeckCondition.NEW_IN_PLASTIC
    @observable
    buyItNow = ""
    @observable
    language = DeckLanguage.ENGLISH
    @observable
    askingPrice = ""
    @observable
    listingInfo = ""
    @observable
    externalLink = ""
    @observable
    expireInDays = "7"
    @observable
    bidIncrement = "1"
    @observable
    startingBid = "1"

    @observable
    preExistingDays = ""

    @observable
    update = false

    @observable
    auctionEndTime: string = ""

    componentDidMount(): void {
        this.auctionEndTime = format(Utils.roundToNearestMinutes(new Date(), 15), "HH:mm")
    }

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
        this.forSale = true
        this.forTrade = true
        this.auction = false
        this.language = DeckLanguage.ENGLISH
        this.condition = DeckCondition.NEW_IN_PLASTIC
        this.askingPrice = ""
        this.listingInfo = ""
        this.externalLink = ""
        this.bidIncrement = "5"
        this.update = false

        if (!userStore.canListMoreAuctions && userStore.auctionsListed > 0) {
            // Check if their auctions have expired.
            userStore.loadLoggedInUser()
        }
    }

    handleOpenForEdit = () => {
        const userDeck = userDeckStore.userDeckByDeckId(this.props.deck.id)
        if (userDeck != null) {
            const {forSale, forTrade, forAuction, condition, askingPrice, listingInfo, externalLink, expiresAtLocalDate, language} = userDeck
            this.open = true
            this.update = true
            this.forSale = forSale
            this.forTrade = forTrade
            this.language = language ? language : DeckLanguage.ENGLISH
            this.condition = condition ? condition : DeckCondition.NEW_IN_PLASTIC
            this.askingPrice = askingPrice ? askingPrice.toString() : ""
            this.listingInfo = listingInfo ? listingInfo : ""
            this.externalLink = externalLink ? externalLink : ""
            if (forAuction) {
                throw new Error("Can't edit auctions.")
            }

            if (expiresAtLocalDate == null) {
                this.expireInDays = "365"
            } else {
                const expiresDate = Utils.parseLocalDate(expiresAtLocalDate)
                this.expireInDays = differenceInDays(expiresDate, new Date()).toString()
                this.preExistingDays = this.expireInDays
            }
        }
    }

    handleChangeDays = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.expireInDays = event.target.value
    }

    list = () => {
        const {
            forSale, forTrade, auction, condition, askingPrice, listingInfo, externalLink, expireInDays, language, bidIncrement,
            startingBid, buyItNow
        } = this
        if (!forSale && !forTrade && !auction) {
            messageStore.setWarningMessage("The deck must be listed for sale, trade or auction.")
            return
        }
        if (listingInfo.length > 2000) {
            messageStore.setWarningMessage("The listing info must be less than 2000 characters long.")
            return
        }
        let askingPriceNumber
        if (askingPrice.trim().length > 0) {
            askingPriceNumber = Number(askingPrice.trim())
            if (isNaN(askingPriceNumber)) {
                messageStore.setWarningMessage("The asking price must be a number.")
                return
            }
        }
        let bidIncrementNumber
        let startingBidNumber
        let buyItNowNumber
        if (auction) {
            if (bidIncrement.trim().length > 0) {
                bidIncrementNumber = Number(bidIncrement.trim())
                if (isNaN(bidIncrementNumber)) {
                    messageStore.setWarningMessage("The bid increment must be a number.")
                    return
                } else if (bidIncrementNumber < 1) {
                    messageStore.setWarningMessage("Bid increment must be greater than 0.")
                    return
                }
            } else {
                messageStore.setWarningMessage("You must include a bid increment.")
                return
            }
            if (startingBid.trim().length > 0) {
                startingBidNumber = Number(startingBid.trim())
                if (isNaN(startingBidNumber)) {
                    messageStore.setWarningMessage("The starting bid must be a number.")
                    return
                }
            } else {
                messageStore.setWarningMessage("You must include a starting bid.")
                return
            }
            if (buyItNow.trim().length > 0) {
                buyItNowNumber = Number(buyItNow.trim())
                if (isNaN(buyItNowNumber)) {
                    messageStore.setWarningMessage("The buy it now must be a number.")
                    return
                }
            }
        }
        const forSaleInCountry = userStore.country

        if (!forSaleInCountry) {
            messageStore.setWarningMessage("Please set your country in your user profile.")
            return
        }

        const listingInfoDto: ListingInfo = {
            deckId: this.props.deck.id,
            forSale,
            forTrade,
            forSaleInCountry,
            language,
            condition,
            listingInfo,
            externalLink,
            expireInDays: Number(expireInDays)
        }
        if (auction) {
            listingInfoDto.auctionListingInfo = {
                startingBid: startingBidNumber as number,
                bidIncrement: bidIncrementNumber as number,
                buyItNow: buyItNowNumber as number,
                endTime: this.auctionEndTime
            }
            auctionStore.createAuction(this.props.deck.name, listingInfoDto)
        } else {
            listingInfoDto.askingPrice = askingPriceNumber
            userDeckStore.listDeck(this.props.deck.name, listingInfoDto)
        }
        this.handleClose()
    }

    render() {
        const deck = this.props.deck
        const userDeck = userDeckStore.userDeckByDeckId(deck.id)
        let saleButton
        if (userDeck && userDeck.forAuction && !userDeck.hasBids) {
            saleButton = (
                <KeyButton
                    color={"primary"}
                    onClick={() => auctionStore.cancel(deck.id)}
                    style={{marginRight: spacing(1)}}
                >
                    Cancel Auction
                </KeyButton>
            )
        } else if (userDeck && (userDeck.forSale || userDeck.forTrade || userDeck.forAuction)) {
            saleButton = (
                <>
                    {userDeck.forAuction ? null : (
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
                    )}
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
        const forSaleOrAuction = this.forSale || this.auction

        const marginTopRight: React.CSSProperties = {
            marginTop: spacing(2), marginRight: spacing(2)
        }

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
                            `Sell or trade "${deck.name}"`
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
                        {this.auction ? (
                            <Typography variant={"subtitle2"} color={"error"} style={{marginRight: spacing(2)}}>
                                Auctions cannot be cancelled or modified after a bid has been placed.
                            </Typography>
                        ) : null}
                        {!this.auction || userStore.canListMoreAuctions ? null : (
                            <div style={{marginBottom: spacing(2)}}>
                                <Typography variant={"subtitle2"} color={"error"} style={{marginBottom: spacing(2)}}>
                                    Upgrade your patron level to list more auctions. You can have {userStore.auctionsAllowed} simultaneous auctions.
                                </Typography>
                                <PatronButton/>
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
                                            } else {
                                                this.auction = false
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
                                        onChange={(event) => {
                                            const forTrade = event.target.checked
                                            this.forTrade = forTrade
                                            if (forTrade) {
                                                this.auction = false
                                            }
                                        }}
                                        color={"primary"}
                                    />
                                }
                                label={"For trade"}
                            />
                            {this.update ? null : (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.auction}
                                            onChange={(event) => {
                                                const auction = event.target.checked
                                                this.auction = auction
                                                this.forSale = !auction
                                                this.forTrade = !auction
                                                if (auction) {
                                                    this.expireInDays = "3"
                                                }
                                            }}
                                            color={"primary"}
                                        />
                                    }
                                    label={"Auction"}
                                />
                            )}
                        </FormGroup>
                        <TextField
                            select={true}
                            label={this.auction ? "Duration" : "Expires In"}
                            value={this.expireInDays}
                            onChange={this.handleChangeDays}
                            style={marginTopRight}
                        >
                            <MenuItem value={"1"}>
                                1 day
                            </MenuItem>
                            <MenuItem value={"2"}>
                                2 days
                            </MenuItem>
                            <MenuItem value={"3"}>
                                3 days
                            </MenuItem>
                            <MenuItem value={"7"}>
                                7 days
                            </MenuItem>
                            {this.auction ? null : (
                                [
                                    <MenuItem value={"10"} key={"10"}>
                                        10 days
                                    </MenuItem>,
                                    <MenuItem value={"30"} key={"30"}>
                                        30 days
                                    </MenuItem>,
                                ]
                            )}
                            {this.auction || !userStore.patron ? null : (
                                <MenuItem value={"365"}>
                                    One year
                                </MenuItem>
                            )}
                            {this.auction || !this.preExistingDays ? null : (
                                <MenuItem value={this.preExistingDays}>
                                    {this.preExistingDays} days
                                </MenuItem>
                            )}
                        </TextField>
                        {this.auction ? (
                            <TextField
                                label={"End Time"}
                                type={"time"}
                                value={this.auctionEndTime}
                                onChange={event => this.auctionEndTime = event.target.value}
                                inputProps={{
                                    step: 900
                                }}
                                style={marginTopRight}
                            />
                        ) : null}
                        <TextField
                            select={true}
                            label={"Language"}
                            value={this.language}
                            onChange={(event) => this.language = event.target.value as DeckLanguage}
                            style={marginTopRight}
                        >
                            {Utils.enumValues(DeckLanguage).map(language => {
                                return (
                                    <MenuItem key={language} value={language}>
                                        {startCase((language as string).toLowerCase())}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                        <TextField
                            select={true}
                            label={"Condition"}
                            value={this.condition}
                            onChange={(event) => this.condition = event.target.value as DeckCondition}
                            style={marginTopRight}
                        >
                            {Utils.enumValues(DeckCondition).map(condition => {
                                return (
                                    <MenuItem key={condition} value={condition}>
                                        {deckConditionReadableValue(condition as DeckCondition)}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                        {forSaleOrAuction ? (
                            <TextField
                                label={this.auction ? "Starting bid" : "Asking price"}
                                type={"number"}
                                value={this.auction ? this.startingBid : this.askingPrice}
                                onChange={(event) => {
                                    if (this.auction) {
                                        this.startingBid = event.target.value
                                    } else {
                                        this.askingPrice = event.target.value
                                    }
                                }}
                                style={{width: 120, ...marginTopRight}}
                            />
                        ) : null}
                        {this.auction ? (
                            <>
                                <TextField
                                    label={"Min Increment"}
                                    type={"number"}
                                    value={this.bidIncrement}
                                    onChange={(event) => this.bidIncrement = event.target.value}
                                    style={{width: 120, ...marginTopRight}}
                                />
                                <TextField
                                    label={"Buy it now"}
                                    type={"number"}
                                    value={this.buyItNow}
                                    onChange={(event) => this.buyItNow = event.target.value}
                                    style={{width: 120, ...marginTopRight}}
                                />
                            </>
                        ) : null}
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
                                Add generic info for all deck listings on your
                            </Typography>
                            <LinkButton
                                to={Routes.myProfile}
                                style={{margin: spacing(1)}}
                            >
                                Profile
                            </LinkButton>
                        </div>
                        {this.auction ? (
                            <Typography color={"textSecondary"} style={{fontStyle: "italic", marginBottom: spacing(1)}}>
                                Auctions are automatically extended by 15 minutes if a bid comes in in their last 15 minutes. You and the winner will receive
                                an email when the auction is complete.
                            </Typography>
                        ) : null}
                        <Typography color={"textSecondary"} style={{fontStyle: "italic"}}>
                            Please add noreply@decksofkeyforge.com to your email contacts, or check your spam filter if you have decks listed for sale.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Cancel</KeyButton>
                        <KeyButton color={"primary"} onClick={this.list} disabled={!forSaleInCountry || (this.auction && !userStore.canListMoreAuctions)}>
                            {this.update ? "Update Listing" : "List"}
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
