import { Dialog, FormControl, FormLabel, Radio, RadioGroup, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { differenceInDays, format } from "date-fns"
import { startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { DeckListingStatus } from "../../auctions/DeckListingDto"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { SendEmailVerification } from "../../emails/SendEmailVerification"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { PatronButton } from "../../thirdpartysites/patreon/PatronButton"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { ListingInfo } from "../../userdeck/ListingInfo"
import { DeckCondition, deckConditionReadableValue } from "../../userdeck/UserDeck"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { DeckActionClickable } from "../buttons/DeckActionClickable"
import { Deck } from "../Deck"
import { DeckLanguage } from "../DeckLanguage"

interface ListForSaleViewProps {
    deck: Deck
    menuItem?: boolean
}

enum SaleType {
    STANDARD,
    AUCTION,
    ACCEPTING_OFFERS
}

@observer
export class ListForSaleView extends React.Component<ListForSaleViewProps> {

    @observable
    open = false

    @observable
    saleType = SaleType.STANDARD
    @observable
    condition = DeckCondition.NEAR_MINT
    @observable
    buyItNow = ""
    @observable
    language = DeckLanguage.ENGLISH
    @observable
    listingInfo = ""
    @observable
    externalLink = ""
    @observable
    expireInDays = "7"
    @observable
    bidIncrement = ""
    @observable
    startingBid = ""

    @observable
    preExistingDays = ""

    @observable
    auctionEndTime = ""

    @observable
    editAuctionId?: string

    componentDidMount(): void {
        this.auctionEndTime = format(Utils.roundToNearestMinutes(new Date(), 15), "HH:mm")
    }

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true

        const defaults = keyLocalStorage.saleDefaults == null ? {} : keyLocalStorage.saleDefaults
        if (defaults.bidIncrement != null) {
            this.saleType = SaleType.AUCTION
        } else if (defaults.acceptingOffers) {
            this.saleType = SaleType.ACCEPTING_OFFERS
        }
        this.language = defaults.language == null ? DeckLanguage.ENGLISH : defaults.language
        this.condition = defaults.condition == null ? DeckCondition.NEW_IN_PLASTIC : defaults.condition
        this.listingInfo = defaults.listingInfo == null ? "" : defaults.listingInfo
        this.externalLink = defaults.externalLink == null ? "" : defaults.externalLink
        this.bidIncrement = defaults.bidIncrement == null ? "" : defaults.bidIncrement.toString()
        this.startingBid = defaults.startingBid == null ? "" : defaults.startingBid.toString()
        this.buyItNow = defaults.buyItNow == null ? "" : defaults.buyItNow.toString()
        this.expireInDays = defaults.expireInDays == null ? "7" : defaults.expireInDays.toString()

        this.editAuctionId = undefined

        if (!userStore.canListMoreAuctions && userStore.auctionsListed > 0) {
            // Check if their auctions have expired.
            userStore.loadLoggedInUser()
        }
    }

    handleOpenForEdit = async () => {
        const saleInfo = deckListingStore.listingInfoForDeck(this.props.deck.id)
        if (saleInfo != null) {
            await deckListingStore.findDeckListingInfo(saleInfo.id)
            const {condition, buyItNow, listingInfo, externalLink, expiresAtLocalDate, language, status, acceptingOffers} = deckListingStore.listingInfo!
            this.open = true
            this.editAuctionId = saleInfo.id
            this.language = language ?? DeckLanguage.ENGLISH
            this.condition = condition ?? DeckCondition.NEW_IN_PLASTIC
            this.listingInfo = listingInfo ?? ""
            this.externalLink = externalLink ?? ""
            this.buyItNow = buyItNow?.toString() ?? ""
            if (acceptingOffers) {
                this.saleType = SaleType.ACCEPTING_OFFERS
            }
            if (status !== DeckListingStatus.SALE) {
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

    handleChangeDays = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.expireInDays = event.target.value
    }

    list = (saveAsDefault?: boolean) => {
        const {
            saleType, condition, listingInfo, externalLink, expireInDays, language, bidIncrement,
            startingBid, buyItNow
        } = this
        const auction = saleType === SaleType.AUCTION
        if (listingInfo.length > 2000) {
            messageStore.setWarningMessage("The listing info must be less than 2000 characters long.")
            return
        }
        let buyItNowNumber
        if (buyItNow.trim().length > 0) {
            buyItNowNumber = Number(buyItNow.trim())
            if (isNaN(buyItNowNumber)) {
                messageStore.setWarningMessage("The buy it now must be a number.")
                return
            }
        }
        let bidIncrementNumber
        let startingBidNumber
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
        }
        const forSaleInCountry = userStore.country

        if (!forSaleInCountry) {
            messageStore.setWarningMessage("Please set your country in your user profile.")
            return
        }

        const externalLinkTrimmed = externalLink.trim()
        if (externalLinkTrimmed.length > 0 && !externalLinkTrimmed.startsWith("http")) {
            messageStore.setWarningMessage(`Please ensure the external link is a web URL starting with "http".`)
            return
        }

        const listingInfoDto: ListingInfo = {
            deckId: this.props.deck.id,
            acceptingOffers: this.saleType === SaleType.ACCEPTING_OFFERS,
            forSaleInCountry,
            language,
            condition,
            listingInfo,
            externalLink: externalLinkTrimmed,
            buyItNow: buyItNowNumber,
            expireInDays: Number(expireInDays),
            editAuctionId: this.editAuctionId
        }
        if (auction) {
            listingInfoDto.startingBid = startingBidNumber
            listingInfoDto.bidIncrement = bidIncrementNumber
            listingInfoDto.endTime = this.auctionEndTime
        }

        if (saveAsDefault) {
            delete listingInfoDto.deckId
            keyLocalStorage.setSaleDefaults(listingInfoDto)
        } else {
            deckListingStore.listForSale(this.props.deck.name, listingInfoDto)
            this.handleClose()
        }
    }

    render() {
        const {deck, menuItem} = this.props
        const userDeck = userDeckStore.userDeckByDeckId(deck.id)
        if (userDeck == null) {
            return null
        }
        if (!deck.registered) {
            return null
        }
        const auctionInfo = deckListingStore.listingInfoForDeck(deck.id)
        let saleButton
        if (auctionInfo && auctionInfo.status === DeckListingStatus.AUCTION && !auctionInfo.bidsExist) {
            saleButton = (
                <DeckActionClickable
                    menuItem={menuItem}
                    onClick={() => deckListingStore.cancel(deck.name, deck.id)}
                >
                    Cancel Auction
                </DeckActionClickable>
            )
        } else if (auctionInfo) {
            saleButton = (
                <>
                    <DeckActionClickable
                        menuItem={menuItem}
                        onClick={this.handleOpenForEdit}
                    >
                        Edit Listing
                    </DeckActionClickable>
                    <DeckActionClickable
                        menuItem={menuItem}
                        onClick={() => deckListingStore.cancel(deck.name, deck.id)}
                    >
                        Unlist
                    </DeckActionClickable>
                </>
            )
        } else {
            saleButton = (
                <DeckActionClickable
                    menuItem={menuItem}
                    onClick={this.handleOpen}
                >
                    Sell
                </DeckActionClickable>
            )
        }

        const forSaleInCountry = userStore.country
        const shippingCost = userStore.shippingCost

        const marginTopRight: React.CSSProperties = {
            marginTop: spacing(2), marginRight: spacing(2)
        }

        const auction = this.saleType === SaleType.AUCTION

        return (
            <>
                {saleButton}
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        {this.editAuctionId != null ? (
                            `Update listing for "${deck.name}"`
                        ) : (
                            `Sell or trade "${deck.name}"`
                        )}
                    </DialogTitle>
                    <DialogContent>
                        <SendEmailVerification message={"Please verify your email to list decks for sale or trade."}/>
                        {forSaleInCountry == null || shippingCost == null && (
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div>
                                    {forSaleInCountry == null && (
                                        <Typography variant={"subtitle2"} color={"error"} style={{marginRight: spacing(2)}}>
                                            Please choose your country on your profile to list decks.
                                        </Typography>
                                    )}
                                    {shippingCost == null && (
                                        <Typography variant={"subtitle2"} color={"error"} style={{marginRight: spacing(2)}}>
                                            Fill out shipping costs on your profile to list decks.
                                        </Typography>
                                    )}
                                </div>
                                <LinkButton
                                    to={Routes.myProfile}
                                >
                                    Profile
                                </LinkButton>
                            </div>
                        )}
                        {auction ? (
                            <div style={{marginBottom: spacing(2)}}>
                                <Typography variant={"subtitle2"} color={"error"}>
                                    Auctions cannot be cancelled or modified after a bid has been placed.
                                </Typography>
                            </div>
                        ) : null}
                        {!auction || userStore.canListMoreAuctions ? null : (
                            <div style={{marginBottom: spacing(2)}}>
                                <Typography variant={"subtitle2"} color={"error"} style={{marginBottom: spacing(2)}}>
                                    Upgrade your patron level to list more auctions. You can have {userStore.auctionsAllowed} simultaneous auctions.
                                </Typography>
                                <PatronButton/>
                            </div>
                        )}
                        <FormControl fullWidth={true}>
                            <FormLabel>Sale Type</FormLabel>
                            <RadioGroup

                                name="sale type"
                                value={this.saleType}
                                onChange={(event) => {
                                    const previousSaleType = this.saleType
                                    this.saleType = Number(event.target.value)
                                    if (this.saleType === SaleType.AUCTION) {
                                        this.expireInDays = "3"
                                        this.bidIncrement = "1"
                                        this.startingBid = "1"
                                    } else if (previousSaleType === SaleType.AUCTION) {
                                        this.expireInDays = "7"
                                        this.bidIncrement = ""
                                        this.startingBid = ""
                                    }
                                    this.auctionEndTime = ""
                                }}
                            >
                                <div style={{display: "flex"}}>
                                    <FormControlLabel
                                        value={SaleType.STANDARD}
                                        control={<Radio/>}
                                        label="Standard"
                                    />
                                    <FormControlLabel
                                        value={SaleType.ACCEPTING_OFFERS}
                                        control={<Radio/>}
                                        label="Accepting Offers"
                                    />
                                    <FormControlLabel
                                        value={SaleType.AUCTION}
                                        control={<Radio/>}
                                        label="Auction"
                                        disabled={!!this.editAuctionId}
                                    />
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            select={true}
                            label={auction ? "Duration" : "Expires In"}
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
                            {auction ? null : (
                                [
                                    <MenuItem value={"10"} key={"10"}>
                                        10 days
                                    </MenuItem>,
                                    <MenuItem value={"30"} key={"30"}>
                                        30 days
                                    </MenuItem>,
                                ]
                            )}
                            {auction || !userStore.patron ? null : (
                                <MenuItem value={"365"}>
                                    One year
                                </MenuItem>
                            )}
                            {auction || !this.preExistingDays ? null : (
                                <MenuItem value={this.preExistingDays}>
                                    {this.preExistingDays} days
                                </MenuItem>
                            )}
                        </TextField>
                        {auction ? (
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
                        {auction ? (
                            <TextField
                                label={"Starting bid"}
                                type={"number"}
                                value={this.startingBid}
                                onChange={(event) => {
                                    this.startingBid = event.target.value
                                }}
                                style={{width: 120, ...marginTopRight}}
                            />
                        ) : null}
                        {auction ? (
                            <>
                                <TextField
                                    label={"Min Increment"}
                                    type={"number"}
                                    value={this.bidIncrement}
                                    onChange={(event) => this.bidIncrement = event.target.value}
                                    style={{width: 120, ...marginTopRight}}
                                />
                            </>
                        ) : null}
                        <TextField
                            label={auction ? "Buy it now" : "Price"}
                            type={"number"}
                            value={this.buyItNow}
                            onChange={(event) => this.buyItNow = event.target.value}
                            style={{width: 120, ...marginTopRight}}
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
                        <TextField
                            label={"External listing link"}
                            value={this.externalLink}
                            onChange={(event) => this.externalLink = event.target.value}
                            fullWidth={true}
                            helperText={"Ebay link, store link, etc."}
                            style={{marginTop: spacing(2)}}
                        />
                        <div style={{display: "flex", alignItems: "center", marginTop: spacing(2)}}>
                            <Typography>
                                Add generic info and toggle trades on your
                            </Typography>
                            <LinkButton
                                to={Routes.myProfile}
                                style={{margin: spacing(1)}}
                            >
                                Profile
                            </LinkButton>
                        </div>
                        {auction ? (
                            <>
                                <Typography color={"textSecondary"} style={{fontStyle: "italic", marginBottom: spacing(1)}}>
                                    Server instability can prevent users from bidding on an auction. If this significantly impacts the
                                    auction results you may relist the auction with a note in the description explaining why
                                    it was relisted.
                                </Typography>
                                <Typography color={"textSecondary"} style={{fontStyle: "italic", marginBottom: spacing(1)}}>
                                    Auctions are automatically extended 15 minutes when bid upon in the last 15 minutes. You and the winner
                                    will be receive an email when the auction is complete.
                                </Typography>
                            </>
                        ) : null}
                    </DialogContent>
                    <DialogActions>
                        <KeyButton
                            style={{marginLeft: spacing(1)}}
                            onClick={() => this.list(true)}
                            disabled={!userStore.emailVerified || !forSaleInCountry || (auction && !userStore.canListMoreAuctions)}
                        >
                            {"Save Default"}
                        </KeyButton>
                        <div style={{flexGrow: 1}}/>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Cancel</KeyButton>
                        <KeyButton
                            style={{marginRight: spacing(1)}}
                            color={"primary"}
                            onClick={() => this.list()}
                            disabled={!userStore.canListForSale || (auction && !userStore.canListMoreAuctions)}
                        >
                            {this.editAuctionId != null ? "Update Listing" : "List"}
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}
