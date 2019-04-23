import { Tooltip } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { AuctionStatus } from "../../auctions/AuctionDto"
import { BidButton } from "../../auctions/BidButton"
import { BidHistoryButton } from "../../auctions/BidHistoryButton"
import { BuyItNowButton } from "../../auctions/BuyItNowButton"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { SendSellerEmailDialog } from "../../emails/SendSellerEmailDialog"
import { countryToLabel } from "../../generic/Country"
import { DiscordUser } from "../../generic/DiscordUser"
import { AuctionDeckIcon } from "../../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { KeyCard } from "../../generic/KeyCard"
import { UnstyledLink } from "../../generic/UnstyledLink"
import { SellerImg } from "../../sellers/imgs/SellerImgs"
import { sellerStore } from "../../sellers/SellerStore"
import { userStore } from "../../user/UserStore"
import { deckConditionReadableValue } from "../../userdeck/UserDeck"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { DeckSaleInfo, deckSaleInfoFromUserDeckDto } from "./DeckSaleInfo"
import { SingleSaleInfoViewCompleteAuction } from "./SingleSaleInfoViewCompleteAuction"

interface SaleInfoViewProps {
    saleInfo: DeckSaleInfo[]
    deckName: string
    keyforgeId: string
    deckId: number
}

@observer
export class SaleInfoView extends React.Component<SaleInfoViewProps> {
    render() {
        if (this.props.saleInfo.length === 0) {
            return null
        }
        return (
            <div>
                {this.props.saleInfo.map((saleInfo) => {

                    let userDeckInfo
                    if (saleInfo.username === userStore.username) {
                        const userDeck = userDeckStore.userDecks && userDeckStore.userDecks.get(this.props.deckId)
                        userDeckInfo = userDeck ? deckSaleInfoFromUserDeckDto(userDeck) : undefined
                    }

                    return (
                        <div style={{marginTop: spacing(2), marginBottom: spacing(2)}} key={saleInfo.username}>
                            <SingleSaleInfoView
                                saleInfo={userDeckInfo ? userDeckInfo : saleInfo}
                                deckName={this.props.deckName}
                                keyforgeId={this.props.keyforgeId}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }
}

@observer
export class SingleSaleInfoView extends React.Component<{ saleInfo: DeckSaleInfo, deckName: string, keyforgeId: string }> {
    render() {

        if (this.props.saleInfo.auctionStatus === AuctionStatus.COMPLETE) {
            return <SingleSaleInfoViewCompleteAuction {...this.props} />
        }

        const {
            forSale, forTrade, forAuction, forSaleInCountry, askingPrice, condition, dateListed, expiresAt, listingInfo, username, publicContactInfo, externalLink,
            discord, language, currencySymbol, highestBid, buyItNow, bidIncrement, auctionEndDateTime, auctionId, nextBid, youAreHighestBidder, yourMaxBid,
            startingBid
        } = this.props.saleInfo

        const yourUsername = userStore.username
        const yourEmail = userStore.email

        const allowEmail = yourEmail && yourUsername && !externalLink

        const sellerDetails = sellerStore.findSellerWithUsername(username)

        return (
            <KeyCard
                style={{width: 328}}
                topContents={
                    (
                        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>
                            <div style={{display: "flex"}}>
                                {forSale ? (
                                    <Tooltip title={"For sale"}>
                                        <div><SellDeckIcon height={48}/></div>
                                    </Tooltip>
                                ) : null}
                                {forTrade && forSale ? <div style={{marginRight: spacing(1)}}/> : null}
                                {forTrade ? (
                                    <Tooltip title={"For trade"}>
                                        <div><TradeDeckIcon height={48}/></div>
                                    </Tooltip>
                                ) : null}
                                {forAuction ? (
                                    <Tooltip title={"Auction"}>
                                        <div><AuctionDeckIcon height={48}/></div>
                                    </Tooltip>
                                ) : null}
                            </div>
                            {askingPrice == null ? null :
                                (
                                    <Typography variant={"h4"} style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}>
                                        {currencySymbol}{askingPrice}
                                    </Typography>
                                )
                            }
                            {!forAuction ? null :
                                (
                                    <div>
                                        <Typography
                                            variant={"h5"}
                                            style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}
                                        >
                                            Bid: {currencySymbol}{highestBid ? highestBid : startingBid}
                                        </Typography>
                                        {buyItNow == null ? null : (
                                            <Typography variant={"h5"} style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}>
                                                BIN: {currencySymbol}{buyItNow}
                                            </Typography>
                                        )}
                                    </div>
                                )
                            }
                            <Typography variant={"subtitle1"} style={{color: "#FFFFFF"}}>
                                {deckConditionReadableValue(condition)}
                            </Typography>
                        </div>
                    )
                }
            >
                <div>
                    {!forAuction ? null : (
                        <div style={{margin: spacing(2)}}>
                            <div style={{display: "flex"}}>
                                <Typography variant={"subtitle2"} style={{marginRight: spacing(2)}}>Ending on:</Typography>
                                <Typography variant={"subtitle2"}>{auctionEndDateTime}</Typography>
                            </div>
                            {youAreHighestBidder ? (
                                <Typography style={{marginTop: spacing(2)}}>
                                    You are the highest bidder! Your max bid: {currencySymbol}{yourMaxBid}
                                </Typography>
                            ) : null}
                            <div style={{display: "flex", alignItems: "center", marginTop: spacing(2)}}>
                                <BidButton
                                    currentBid={highestBid}
                                    bidIncrement={bidIncrement!}
                                    currencySymbol={currencySymbol}
                                    auctionId={auctionId!}
                                    nextValidBid={nextBid!}
                                    sellerUsername={username}
                                    youAreHighestBidder={!!youAreHighestBidder}
                                    style={{marginRight: spacing(2)}}
                                />
                                {buyItNow == null ? null : (
                                    <BuyItNowButton currencySymbol={currencySymbol} auctionId={auctionId!} sellerUsername={username} buyItNow={buyItNow}/>
                                )}
                                <div style={{flexGrow: 1}}/>
                                <BidHistoryButton auctionId={auctionId!}/>
                            </div>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {sellerDetails == null ? null : (
                        <div style={{display: "flex", alignItems: "center", margin: spacing(2), marginBottom: 0}}>
                            <SellerImg sellerUsername={username}/>
                            <UnstyledLink to={Routes.userDecksForSale(username)}>
                                <Typography variant={"h5"}>{sellerDetails.storeName}</Typography>
                            </UnstyledLink>
                        </div>
                    )}
                    {!listingInfo ? null : (
                        <div style={{margin: spacing(2), marginBottom: 0}}>
                            <Typography variant={"subtitle2"}>Listing Details</Typography>
                            <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{listingInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {!externalLink ? null : (
                        <div style={{margin: spacing(2), marginBottom: 0}}>
                            <Typography variant={"subtitle2"}>External listing — Be careful using this link!</Typography>
                            <a href={externalLink} target={"_blank"}><Typography>{externalLink}</Typography></a>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {!publicContactInfo ? null : (
                        <div style={{margin: spacing(2), marginBottom: 0}}>
                            <Typography variant={"subtitle2"}>Seller Details</Typography>
                            <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{publicContactInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {discord || (allowEmail && !forAuction) ? (
                        <div style={{margin: spacing(2), marginTop: 0}}>
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                {discord ? (
                                    <DiscordUser discord={discord} style={{marginTop: spacing(2)}}/>
                                ) : null}
                                {allowEmail && !forAuction ? (
                                    <>
                                        {discord ? <div style={{flexGrow: 1}}/> : null}
                                        <SendSellerEmailDialog
                                            deckName={this.props.deckName}
                                            senderUsername={yourUsername!}
                                            senderEmail={yourEmail!}
                                            username={username}
                                            keyforgeId={this.props.keyforgeId}
                                            style={{marginTop: spacing(2)}}
                                        />
                                    </>
                                ) : null}
                            </div>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    ) : null}
                    {forSaleInCountry ? (
                        <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                            Located in {countryToLabel(forSaleInCountry)}.
                        </Typography>
                    ) : null}
                    {language ? (
                        <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                            Deck language: {startCase(language.toString().toLowerCase())}
                        </Typography>
                    ) : null}
                    <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                        Listed on {Utils.formatDate(dateListed)} by <Link to={Routes.userProfilePage(username)}>{username}</Link>
                    </Typography>
                    {expiresAt != null && !forAuction ? (
                        <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                            Expires on {Utils.formatDate(expiresAt)}
                        </Typography>
                    ) : null}
                    <Divider style={{marginTop: spacing(2)}}/>
                    <BuyingDisclaimer style={{margin: spacing(2)}}/>
                </div>
            </KeyCard>
        )
    }
}

export const BuyingDisclaimer = (props: { style?: React.CSSProperties }) => (
    <Typography color={"textSecondary"} style={{fontStyle: "italic", ...props.style}}>
        Decks of Keyforge does not verify the authenticity or trustworthiness of any deck sales. Purchase and trade decks at your own risk.
    </Typography>
)
