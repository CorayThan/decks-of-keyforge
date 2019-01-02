import { Tooltip } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { Link } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { KeyCard } from "../../generic/KeyCard"
import { deckConditionReadableValue } from "../../userdeck/UserDeck"
import { DeckSaleInfo } from "./DeckSaleInfo"

interface SaleInfoViewProps {
    saleInfo: DeckSaleInfo[]
}

export class SaleInfoView extends React.Component<SaleInfoViewProps> {
    render() {
        if (this.props.saleInfo.length === 0) {
            return null
        }
        return (
            <div>
                {this.props.saleInfo.map((saleInfo) => {
                    return <div style={{marginTop: spacing(2)}} key={saleInfo.username}><SingleSaleInfoView saleInfo={saleInfo}/></div>
                })}
            </div>
        )
    }
}

export class SingleSaleInfoView extends React.Component<{ saleInfo: DeckSaleInfo }> {
    render() {
        const {
            forSale, forTrade, askingPrice, condition, dateListed, listingInfo, username, publicContactInfo, externalLink
        } = this.props.saleInfo
        return (
            <KeyCard
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
                <div style={{maxWidth: 360}}>
                    {listingInfo == null ? null : (
                        <div style={{margin: spacing(2)}}>
                            <Typography variant={"subtitle2"}>Listing Details</Typography>
                            <Typography variant={"body1"}>{listingInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {externalLink == null ? null : (
                        <div style={{margin: spacing(2)}}>
                            <Typography variant={"subtitle2"}>External listing — Be careful using this link!</Typography>
                            <a href={externalLink}><Typography>{externalLink}</Typography></a>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    {publicContactInfo == null ? null : (
                        <div style={{margin: spacing(2)}}>
                            <Typography variant={"subtitle2"}>Seller Details</Typography>
                            <Typography variant={"body1"}>{publicContactInfo}</Typography>
                            <Divider style={{marginTop: spacing(2)}}/>
                        </div>
                    )}
                    <Typography style={{margin: spacing(2)}} variant={"subtitle2"}>
                        Listed on {Utils.formatDate(dateListed)} by <Link to={Routes.userProfilePage(username)}>{username}</Link>
                    </Typography>
                </div>
            </KeyCard>
        )
    }
}
