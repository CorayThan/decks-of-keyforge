import { Card, CardActions, CardContent, Divider, Typography } from "@material-ui/core"
import { startCase } from "lodash"
import * as React from "react"
import { spacing, theme } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { KeyLink } from "../mui-restyled/KeyLink"
import { LinkButton } from "../mui-restyled/LinkButton"
import { SellerRatingView } from "../sellerratings/SellerRatingView"
import { DiscordUser } from "../thirdpartysites/discord/DiscordUser"
import { SellerImg } from "./imgs/SellerImgs"
import { SellerDetails } from "./SellerDetails"

interface SellerCardProps {
    sellerDetails: SellerDetails
    style?: React.CSSProperties
}

export class SellerCard extends React.Component<SellerCardProps> {
    render() {
        const {storeName, username, storeDescription, discord, email, sellerId} = this.props.sellerDetails
        
        const storeLink = Routes.userDecksForSale(username)

        return (
            <div style={this.props.style}>
                <Card style={{display: "flex", flexDirection: "column", width: 344, margin: theme.spacing(2)}}>
                    <CardContent style={{display: "flex", flexDirection: "column", height: 400, padding: theme.spacing(2, 2, 0, 2)}}>
                            <div style={{display: "flex", alignItems: "flex-end"}}>
                                <SellerImg sellerUsername={username}/>
                                <KeyLink to={storeLink} noStyle={true}>
                                    <Typography variant={"h5"}>{storeName}</Typography>
                                </KeyLink>
                            </div>
                            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                            <SellerRatingView sellerId={sellerId} sellerName={storeName}/>
                            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                            <SellerCardSecondaryInfo sellerDetails={this.props.sellerDetails}/>
                            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>

                            <DiscordUser discord={discord} style={{marginBottom: spacing(2)}}/>

                            <div style={{overflowY: "auto", flexGrow: 1}}>
                                <Typography variant={"body1"}>{storeDescription}</Typography>
                            </div>
                    </CardContent>
                    <div style={{flexGrow: 1}}/>
                    <CardActions>
                        {email ? (
                            <LinkButton
                                href={`mailto:${email}`}
                                target={"_blank"} rel={"noopener noreferrer"}
                                color={"primary"}
                            >
                                Send Email
                            </LinkButton>
                        ) : null}
                        <div style={{flexGrow: 1}}/>
                        <LinkButton color="primary" to={storeLink}>
                            View Store
                        </LinkButton>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export const SellerCardSecondaryInfo = (props: { sellerDetails: SellerDetails }) => (
    <>
        <Typography variant={"subtitle1"} color={"textSecondary"}>Shipping from {startCase(props.sellerDetails.country)}</Typography>
        <Typography variant={"subtitle1"} color={"textSecondary"}>{props.sellerDetails.decksAvailable} decks available</Typography>
        <Typography variant={"subtitle1"} color={"textSecondary"}>Most recent listing {props.sellerDetails.mostRecentListing}</Typography>
    </>
)