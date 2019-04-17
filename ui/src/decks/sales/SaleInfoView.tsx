import { Button, IconButton, Tooltip } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import History from "@material-ui/icons/History"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { Link } from "react-router-dom"
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
        const {
            forSale, forTrade, auction, forSaleInCountry, askingPrice, condition, dateListed, expiresAt, listingInfo, username, publicContactInfo, externalLink,
            discord, language, currencySymbol, highestBid, buyItNow, startingBid, auctionEndDateTime
        } = this.props.saleInfo

        const yourUsername = userStore.username
        const yourEmail = userStore.email

        const allowEmail = yourEmail && yourUsername && !externalLink

        const allowEmailOrDiscord = allowEmail || discord

        const sellerDetails = sellerStore.findSellerWithUsername(username)
        const realCurSymbol = currencySymbol ? currencySymbol : "$"
        let nextBid
        if (auction) {
            if (highestBid) {
                nextBid = (
                    <Typography
                        variant={"h5"}
                        style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}
                    >
                        Bid: {realCurSymbol}{highestBid}
                    </Typography>
                )
            } else {
                nextBid = (
                    <Typography
                        variant={"h5"}
                        style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}
                    >
                        Bid: {realCurSymbol}{startingBid}
                    </Typography>
                )
            }
        }

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
                                {auction ? (
                                    <Tooltip title={"Auction"}>
                                        <div><AuctionDeckIcon height={48}/></div>
                                    </Tooltip>
                                ) : null}
                            </div>
                            {askingPrice == null ? null :
                                (
                                    <Typography variant={"h4"} style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}>
                                        {realCurSymbol}{askingPrice}
                                    </Typography>
                                )
                            }
                            {auction == null ? null :
                                (
                                    <div>
                                        {nextBid}
                                        {buyItNow == null ? null : (
                                            <Typography variant={"h5"} style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}>
                                                BIN: {realCurSymbol}{buyItNow}
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
                    {!auction ? null : (
                        <div style={{margin: spacing(2)}}>
                            <div style={{display: "flex"}}>
                                <Typography variant={"subtitle2"} style={{marginRight: spacing(2)}}>Ending on:</Typography>
                                <Typography variant={"subtitle2"}>{auctionEndDateTime}</Typography>
                            </div>
                            <div style={{display: "flex", alignItems: "center", marginTop: spacing(2)}}>
                                {buyItNow == null ? null : (
                                    <div>
                                        <Button color={"primary"} variant={"outlined"} style={{marginRight: spacing(2)}}>
                                            Buy it Now
                                        </Button>
                                    </div>
                                )}
                                <div>
                                    <Button color={"primary"}>
                                        Bid
                                    </Button>
                                </div>
                                <div style={{flexGrow: 1}}/>
                                <IconButton>
                                    <History/>
                                </IconButton>
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
                    {listingInfo == null ? null : (
                        <div style={{margin: spacing(2), marginBottom: 0}}>
                            <Typography variant={"subtitle2"}>Listing Details</Typography>
                            <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{listingInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {externalLink == null ? null : (
                        <div style={{margin: spacing(2), marginBottom: 0}}>
                            <Typography variant={"subtitle2"}>External listing — Be careful using this link!</Typography>
                            <a href={externalLink} target={"_blank"}><Typography>{externalLink}</Typography></a>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {publicContactInfo == null ? null : (
                        <div style={{margin: spacing(2), marginBottom: 0}}>
                            <Typography variant={"subtitle2"}>Seller Details</Typography>
                            <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{publicContactInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {allowEmailOrDiscord ? (
                        <div style={{margin: spacing(2), marginTop: 0}}>
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                {discord ? (
                                    <DiscordUser discord={discord} style={{marginTop: spacing(2)}}/>
                                ) : null}
                                {allowEmail && !auction ? (
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
                            {discord || (allowEmail && !auction ? (
                                <Divider style={{marginTop: spacing(2)}}/>
                            ) : null)}
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
                    {expiresAt != null && !auction ? (
                        <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                            Expires on {Utils.formatDate(expiresAt)}
                        </Typography>
                    ) : null}
                    <Divider style={{marginTop: spacing(2)}}/>
                    <Typography style={{margin: spacing(2), fontStyle: "italic"}} variant={"subtitle2"} color={"textSecondary"}>
                        We do not verify the authenticity or trustworthiness of any deck sales.
                        Purchase and trade decks at your own risk.
                    </Typography>
                </div>
            </KeyCard>
        )
    }
}
