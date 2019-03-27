import { Tooltip } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { SendSellerEmailDialog } from "../../emails/SendSellerEmailDialog"
import { countryToLabel } from "../../generic/Country"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { KeyCard } from "../../generic/KeyCard"
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
            forSale, forTrade, forSaleInCountry, askingPrice, condition, dateListed, expiresAt, listingInfo, username, publicContactInfo, externalLink
        } = this.props.saleInfo

        const yourUsername = userStore.username
        const yourEmail = userStore.email

        const allowEmail = yourEmail && yourUsername && !externalLink

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
                            </div>
                            {askingPrice == null ? null :
                                <Typography variant={"h4"} style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}>
                                    ${askingPrice}
                                </Typography>}
                            <Typography variant={"subtitle1"} style={{color: "#FFFFFF"}}>
                                {deckConditionReadableValue(condition)}
                            </Typography>
                        </div>
                    )
                }
            >
                <div>
                    {listingInfo == null ? null : (
                        <div style={{margin: spacing(2)}}>
                            <Typography variant={"subtitle2"}>Listing Details</Typography>
                            <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{listingInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {externalLink == null ? null : (
                        <div style={{margin: spacing(2)}}>
                            <Typography variant={"subtitle2"}>External listing — Be careful using this link!</Typography>
                            <a href={externalLink} target={"_blank"}><Typography>{externalLink}</Typography></a>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {publicContactInfo == null ? null : (
                        <div style={{margin: spacing(2)}}>
                            <Typography variant={"subtitle2"}>Seller Details</Typography>
                            <Typography variant={"body1"} style={{whiteSpace: "pre-wrap"}}>{publicContactInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {allowEmail ? (
                        <div style={{margin: spacing(2)}}>
                            <SendSellerEmailDialog
                                deckName={this.props.deckName}
                                senderUsername={yourUsername!}
                                senderEmail={yourEmail!}
                                username={username}
                                keyforgeId={this.props.keyforgeId}
                            />
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    ) : null}
                    {forSaleInCountry ? (
                        <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                            Located in {countryToLabel(forSaleInCountry)}.
                        </Typography>
                    ) : null}
                    <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                        Listed on {Utils.formatDate(dateListed)} by <Link to={Routes.userProfilePage(username)}>{username}</Link>
                    </Typography>
                    {expiresAt != null ? (
                        <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                            Expires on {Utils.formatDate(expiresAt)}
                        </Typography>
                    ) : null}
                    <Divider style={{marginTop: spacing(2)}}/>
                    <Typography style={{margin: spacing(2), fontStyle: "italic"}} variant={"subtitle2"}>
                        We do not verify the authenticity or trustworthiness of any deck sales.
                        Purchase and trade decks at your own risk.
                    </Typography>
                </div>
            </KeyCard>
        )
    }
}
