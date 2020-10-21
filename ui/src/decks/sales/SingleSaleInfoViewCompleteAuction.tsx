import { Link } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { BidHistoryButton } from "../../auctions/BidHistoryButton"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { DeckSaleInfo } from "../../generated-src/DeckSaleInfo"
import { countryToLabel } from "../../generic/CountryUtils"
import { UnstyledLink } from "../../generic/UnstyledLink"
import { SellerImg } from "../../sellers/imgs/SellerImgs"
import { sellerStore } from "../../sellers/SellerStore"
import { userStore } from "../../user/UserStore"
import { deckConditionReadableValue } from "../../userdeck/DeckConditionUtils"

@observer
export class SingleSaleInfoViewCompleteAuction extends React.Component<{ saleInfo: DeckSaleInfo, deckName: string, keyforgeId: string }> {
    render() {
        const {
            forAuction, forSaleInCountry, condition, dateListed, listingInfo, username, publicContactInfo,
            language, currencySymbol, highestBid, buyItNow, auctionEndDateTime, auctionId, youAreHighestBidder,
            startingBid, boughtBy, boughtNowOn, shippingCost
        } = this.props.saleInfo

        const sellerDetails = sellerStore.findSellerWithUsername(username)
        const realCurSymbol = currencySymbol ? currencySymbol : "$"

        return (
            <div>
                <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: spacing(2)}}>
                    <div>
                        <Typography
                            variant={"h5"}
                            style={{marginLeft: spacing(1), marginRight: spacing(1)}}
                        >
                            Bid: {realCurSymbol}{highestBid ? highestBid : startingBid}
                        </Typography>
                        {buyItNow == null ? null : (
                            <Typography variant={"h5"} style={{marginLeft: spacing(1), marginRight: spacing(1)}}>
                                BIN: {realCurSymbol}{buyItNow}
                            </Typography>
                        )}
                    </div>
                    <Typography variant={"subtitle1"} style={{color: "#FFFFFF"}}>
                        {deckConditionReadableValue(condition)}
                    </Typography>
                </div>
                {!forAuction ? null : (
                    <div style={{margin: spacing(2)}}>
                        {youAreHighestBidder || boughtBy === userStore.username ? (
                            <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                                You won this auction!
                            </Typography>
                        ) : null}
                        <div style={{display: "flex"}}>
                            {boughtNowOn ? (
                                <Typography variant={"h5"}>
                                    Sold for ${buyItNow}
                                </Typography>
                            ) : highestBid ? (
                                <Typography variant={"h5"}>
                                    Sold for ${highestBid}
                                </Typography>
                            ) : (
                                <Typography variant={"h5"}>
                                    Not sold
                                </Typography>
                            )}
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            {boughtNowOn ? (
                                <Typography variant={"subtitle1"}>
                                    Bought now on {boughtNowOn}
                                </Typography>
                            ) : (
                                <Typography variant={"subtitle1"}>
                                    Auction ended on {auctionEndDateTime}
                                </Typography>
                            )}
                            <div style={{flexGrow: 1}}/>
                            <BidHistoryButton auctionId={auctionId!}/>
                        </div>
                        <Divider style={{marginTop: spacing(1)}}/>
                    </div>
                )}
                {sellerDetails && (
                    <div style={{display: "flex", alignItems: "center", margin: spacing(2), marginBottom: 0}}>
                        <SellerImg sellerUsername={username}/>
                        <UnstyledLink to={Routes.userDecksForSale(username)}>
                            <Typography variant={"h5"}>{sellerDetails.storeName}</Typography>
                        </UnstyledLink>
                    </div>
                )}
                {listingInfo && (
                    <div style={{margin: spacing(2), marginBottom: 0}}>
                        <Typography variant={"subtitle2"}>Listing Details</Typography>
                        <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{listingInfo}</Typography>
                        <Divider style={{marginTop: spacing(2)}}/>
                    </div>
                )}
                {publicContactInfo && (
                    <div style={{margin: spacing(2), marginBottom: 0}}>
                        <Typography variant={"subtitle2"}>Seller Details</Typography>
                        <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{publicContactInfo}</Typography>
                        <Divider style={{marginTop: spacing(2)}}/>
                    </div>
                )}
                {shippingCost && (
                    <div style={{margin: spacing(2), marginBottom: 0}}>
                        <Typography variant={"subtitle2"}>Shipping Cost</Typography>
                        <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{shippingCost}</Typography>
                        <Divider style={{marginTop: spacing(2)}}/>
                    </div>
                )}
                <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                    Located in {countryToLabel(forSaleInCountry!)}.
                </Typography>
                <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                    Deck language: {startCase(language!.toString().toLowerCase())}
                </Typography>
                <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                    Listed on {Utils.formatDate(dateListed)} by <Link href={Routes.userProfilePage(username)}>{username}</Link>
                </Typography>
            </div>
        )
    }
}
