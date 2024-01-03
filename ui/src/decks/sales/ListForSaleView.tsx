import { Box, Dialog, FormControl, FormLabel, Link, Radio, RadioGroup, Tooltip, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { differenceInDays } from "date-fns"
import { startCase } from "lodash"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { MyDokSubPaths } from "../../config/Routes"
import { TimeUtils } from "../../config/TimeUtils"
import { Utils } from "../../config/Utils"
import { SendEmailVerification } from "../../emails/SendEmailVerification"
import { ExtendedExpansionUtils } from "../../expansions/ExtendedExpansionUtils"
import { DeckCondition } from "../../generated-src/DeckCondition"
import { DeckLanguage } from "../../generated-src/DeckLanguage"
import { DeckListingStatus } from "../../generated-src/DeckListingStatus"
import { ListingInfo } from "../../generated-src/ListingInfo"
import { HelperText } from "../../generic/CustomTypographies"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { PatronButton } from "../../thirdpartysites/patreon/PatronButton"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { deckConditionReadableValue } from "../../userdeck/DeckConditionUtils"
import { DeckActionClickable } from "../buttons/DeckActionClickable"
import { deckTableViewStore } from "../DeckTableViewStore"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { DeckOwnershipButton } from "../ownership/DeckOwnershipButton"
import { SoldButton } from "./SoldButton"

interface ListForSaleViewProps {
    deck?: DeckSearchResult
    deckIds?: number[]
    menuItem?: boolean
}

enum SaleType {
    STANDARD,
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
    newTagName = ""

    @observable
    preExistingDays = ""

    @observable
    relistAtPrice = ""

    @observable
    editAuctionId?: string

    constructor(props: ListForSaleViewProps) {
        super(props)
        makeObservable(this)
    }

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true

        const defaults = keyLocalStorage.saleDefaults == null ? {} : keyLocalStorage.saleDefaults
        if (defaults.acceptingOffers) {
            this.saleType = SaleType.ACCEPTING_OFFERS
        }
        this.language = defaults.language == null ? DeckLanguage.ENGLISH : defaults.language
        this.condition = defaults.condition == null ? DeckCondition.NEW_IN_PLASTIC : defaults.condition
        this.listingInfo = defaults.listingInfo == null ? "" : defaults.listingInfo
        this.externalLink = defaults.externalLink == null ? "" : defaults.externalLink
        this.buyItNow = defaults.buyItNow == null ? "" : defaults.buyItNow.toString()
        this.expireInDays = defaults.expireInDays == null ? "7" : defaults.expireInDays.toString()
        this.newTagName = ""
        this.relistAtPrice = defaults.relistAtPrice == null ? "" : defaults.relistAtPrice.toString()

        this.editAuctionId = undefined

        if (!userStore.canListForSale) {
            // Check if their auctions have expired.
            userStore.loadLoggedInUser()
        }
    }

    handleOpenForEdit = async () => {
        const saleInfo = this.props.deck == null ? undefined : deckListingStore.listingInfoForDeck(this.props.deck.id)
        if (saleInfo != null) {
            await deckListingStore.findDeckListingInfo(saleInfo.id)
            const {
                condition,
                buyItNow,
                listingInfo,
                externalLink,
                expiresAtLocalDate,
                language,
                status,
                acceptingOffers,
                relistAtPrice
            } = deckListingStore.listingInfo!
            this.open = true
            this.editAuctionId = saleInfo.id
            this.language = language ?? DeckLanguage.ENGLISH
            this.condition = condition ?? DeckCondition.NEW_IN_PLASTIC
            this.listingInfo = listingInfo ?? ""
            this.externalLink = externalLink ?? ""
            this.buyItNow = buyItNow?.toString() ?? ""
            this.newTagName = ""
            this.relistAtPrice = relistAtPrice?.toString() ?? ""
            if (acceptingOffers) {
                this.saleType = SaleType.ACCEPTING_OFFERS
            }
            if (status !== DeckListingStatus.SALE) {
                throw new Error("Can't edit auctions.")
            }

            if (expiresAtLocalDate == null) {
                this.expireInDays = "365"
            } else {
                const expiresDate = TimeUtils.parseLocalDate(expiresAtLocalDate)
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
            condition, listingInfo, externalLink, expireInDays, language,
            buyItNow, relistAtPrice
        } = this
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
        let relistAtPriceNumber
        if (relistAtPrice.trim().length > 0) {
            relistAtPriceNumber = Number(relistAtPrice.trim())
            if (isNaN(relistAtPriceNumber)) {
                messageStore.setWarningMessage("The relist at price now must be a number.")
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
            deckId: this.props.deck?.id,
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

        if (saveAsDefault) {
            delete listingInfoDto.deckId
            keyLocalStorage.setSaleDefaults(listingInfoDto)
        } else {
            if (this.props.deckIds != null) {
                deckListingStore.bulkListForSale({
                    listingInfo: listingInfoDto,
                    decks: this.props.deckIds,
                    bulkListingTagName: this.newTagName.trim() === "" ? undefined : this.newTagName
                })
            } else {
                deckListingStore.listForSale(this.props.deck?.name ?? "A Deck", listingInfoDto)
            }
            this.handleClose()
        }
    }

    render() {
        const {deck, deckIds, menuItem} = this.props
        const auctionInfo = deck?.id == null ? null : deckListingStore.listingInfoForDeck(deck.id)
        let saleButton
        if (deckIds != null) {
            saleButton = (
                <KeyButton
                    disabled={deckTableViewStore.selectedDecks.length === 0}
                    variant={"contained"}
                    color={"primary"}
                    onClick={this.handleOpen}
                    style={{marginLeft: spacing(2)}}
                    loading={deckListingStore.performingBulkUpdate}
                >
                    Bulk List / Update Deck Listings
                </KeyButton>
            )
        } else if (auctionInfo && auctionInfo.status === DeckListingStatus.AUCTION && !auctionInfo.bidsExist) {
            saleButton = (
                <DeckActionClickable
                    menuItem={menuItem}
                    onClick={() => {
                        if (deck != null) {
                            deckListingStore.cancel(deck.id, deck.name)
                        }
                    }}
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
                        Edit Sale
                    </DeckActionClickable>
                    {deck && (
                        <SoldButton deck={deck} menuItem={menuItem}/>
                    )}
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

        const marginTopRight: React.CSSProperties = {
            marginTop: spacing(2), marginRight: spacing(2)
        }

        let title = `Sell "${deck?.name}"`
        if (this.editAuctionId != null) {
            title = `Update listing for "${deck?.name}"`
        } else if (deckIds != null) {
            title = "Bulk List / Update Decks for Sale"
        }

        return (
            <>
                {saleButton}
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <SendEmailVerification message={"Please verify your email to list decks for sale or trade."}/>
                        {!userStore.hasCountryAndShippingCost && (
                            <Typography variant={"subtitle2"} color={"error"}
                                        style={{marginRight: spacing(2), marginBottom: spacing(2)}}>
                                Please add a country and shipping costs to your <Link
                                href={MyDokSubPaths.profile}>profile</Link>.
                            </Typography>
                        )}
                        {!userStore.canListMoreSales && (
                            <div style={{marginBottom: spacing(2)}}>
                                <Typography variant={"subtitle2"} color={"error"} style={{marginBottom: spacing(2)}}>
                                    Upgrade your patron level to list more decks for sale. You can
                                    have {userStore.forSaleAllowed} decks listed.
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
                                    this.saleType = Number(event.target.value)
                                    this.relistAtPrice = ""
                                }}
                            >
                                <div style={{display: "flex"}}>
                                    <FormControlLabel
                                        value={SaleType.STANDARD}
                                        control={<Radio/>}
                                        label="Standard"
                                    />
                                    <Tooltip
                                        title={userStore.patron ? "" : "Please become a patron to list decks for offer."}>
                                        <FormControlLabel
                                            value={SaleType.ACCEPTING_OFFERS}
                                            control={<Radio/>}
                                            label="Accepting Offers"
                                            disabled={!userStore.patron}
                                        />
                                    </Tooltip>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            select={true}
                            label={"Expires In"}
                            value={this.expireInDays}
                            onChange={this.handleChangeDays}
                            style={{minWidth: 80, ...marginTopRight}}
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
                            <MenuItem value={"10"} key={"10"}>
                                10 days
                            </MenuItem>,
                            <MenuItem value={"30"} key={"30"}>
                                30 days
                            </MenuItem>,
                            {!userStore.patron ? null : (
                                <MenuItem value={"365"}>
                                    One year
                                </MenuItem>
                            )}
                            {!this.preExistingDays ? null : (
                                <MenuItem value={this.preExistingDays}>
                                    {this.preExistingDays} days
                                </MenuItem>
                            )}
                        </TextField>
                        <TextField
                            select={true}
                            label={"Language"}
                            value={this.language}
                            onChange={(event) => this.language = event.target.value as DeckLanguage}
                            style={{minWidth: 80, ...marginTopRight}}
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
                        <TextField
                            label={this.saleType === SaleType.ACCEPTING_OFFERS ? "Buy it now" : "Price"}
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
                        {deckIds != null && userStore.patron && (
                            <TextField
                                label={"Bulk Sale Tag Name"}
                                value={this.newTagName}
                                onChange={(event) => this.newTagName = event.target.value}
                                fullWidth={true}
                                helperText={
                                    "A bulk sale tag will be created for this listing. This will allow buyers to see all decks that are a part of this " +
                                    "bulk sale. "
                                }
                                style={{marginTop: spacing(2)}}
                            />
                        )}
                        <HelperText style={{marginTop: spacing(2)}}>
                            Add seller info and toggle trades on your <Link href={MyDokSubPaths.profile}>profile</Link>.
                        </HelperText>
                        {deck != null && ExtendedExpansionUtils.allowsEnhancements(deck.expansion) && !deck.hasOwnershipVerification && (
                            <Box mt={2}>
                                <Typography variant={"subtitle2"} color={"error"}>
                                    You can add a deck picture with enhanced cards. Use the image button below!
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <KeyButton
                            style={{marginLeft: spacing(1)}}
                            onClick={() => this.list(true)}
                            disabled={!userStore.emailIsVerified || !forSaleInCountry || !userStore.canListForSale}
                        >
                            {"Save Default"}
                        </KeyButton>
                        {deck && (
                            <DeckOwnershipButton deck={deck} hasVerification={deck.hasOwnershipVerification}/>
                        )}
                        <div style={{flexGrow: 1}}/>
                        <KeyButton onClick={this.handleClose}>Cancel</KeyButton>
                        <KeyButton
                            style={{marginRight: spacing(1)}}
                            color={"primary"}
                            onClick={() => this.list()}
                            disabled={!userStore.canListForSale}
                        >
                            {this.editAuctionId != null ? "Update Listing" : "List"}
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}
