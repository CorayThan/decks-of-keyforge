import { Card, CardActions, CardContent, Divider, Typography } from "@material-ui/core"
import { startCase } from "lodash"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DiscordUser } from "../generic/DiscordUser"
import { UnstyledLink } from "../generic/UnstyledLink"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { SellerImg } from "./imgs/SellerImgs"
import { SellerDetails } from "./SellerDetails"

interface SellerCardProps {
    sellerDetails: SellerDetails
    style?: React.CSSProperties
}

export class SellerCard extends React.Component<SellerCardProps> {
    render() {
        const {storeName, username, decksAvailable, mostRecentListing, country, storeDescription, discord, email} = this.props.sellerDetails
        
        const storeLink = Routes.userDecksForSale(username)

        return (
            <div style={this.props.style}>
                <Card style={{display: "flex", flexDirection: "column", width: 344, height: 416, margin: spacing(2)}}>
                    <CardContent>
                        <div style={{display: "flex", alignItems: "flex-end"}}>
                            <SellerImg sellerUsername={username}/>
                            <UnstyledLink to={storeLink}>
                                <Typography variant={"h5"}>{storeName}</Typography>
                            </UnstyledLink>
                        </div>
                        <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                        <SellerCardSecondaryInfo sellerDetails={this.props.sellerDetails}/>
                        <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>

                        <DiscordUser discord={discord} style={{marginBottom: spacing(2)}}/>

                        <div style={{overflowY: "auto", maxHeight: 104 + (discord ? 0 : 48)}}>
                            <Typography variant={"body1"}>{storeDescription}</Typography>
                        </div>
                    </CardContent>
                    <div style={{flexGrow: 1}}/>
                    <CardActions>
                        {email ? (
                            <KeyButton
                                href={`mailto:${email}`}
                                target={"_blank"}
                                color={"primary"}
                            >
                                Send Email
                            </KeyButton>
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