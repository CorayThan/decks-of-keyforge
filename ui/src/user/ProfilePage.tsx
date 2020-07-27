import { Box, Card, Divider, Link } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { UserProfile } from "../generated-src/UserProfile"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { SellerRatingView } from "../sellerratings/SellerRatingView"
import { DiscordUser } from "../thirdpartysites/discord/DiscordUser"
import { uiStore } from "../ui/UiStore"
import { userStore } from "./UserStore"

interface ProfilePageProps extends RouteComponentProps<{ username: string }> {
}

export class ProfilePage extends React.Component<ProfilePageProps> {
    render() {
        return <ProfileContainer username={this.props.match.params.username}/>
    }
}

interface ProfileContainerProps {
    username: string
}

@observer
export class ProfileContainer extends React.Component<ProfileContainerProps> {

    constructor(props: ProfileContainerProps) {
        super(props)
        userStore.userProfile = undefined
        uiStore.setTopbarValues("Profile", "Profile", "")
    }

    componentDidMount(): void {
        userStore.findUserProfile(this.props.username)
    }

    componentDidUpdate(prevProps: Readonly<ProfileContainerProps>): void {
        if (prevProps.username !== this.props.username) {
            userStore.findUserProfile(this.props.username)
        }
    }

    render() {
        const profile = userStore.userProfile
        if (!profile) {
            return <Loader/>
        }

        return <ProfileView profile={profile}/>
    }
}

interface ProfileViewProps {
    profile: UserProfile
}

@observer
export class ProfileView extends React.Component<ProfileViewProps> {

    constructor(props: ProfileViewProps) {
        super(props)
        uiStore.setTopbarValues(`${props.profile.username}'s Profile`, props.profile.username, "")
    }

    render() {
        const profile = this.props.profile

        const filters = new DeckFilters()
        filters.owner = profile.username
        const decksLink = Routes.deckSearch(filters)

        const forSaleFilters = new DeckFilters()
        forSaleFilters.owner = profile.username
        forSaleFilters.forSale = true
        const forSaleLink = Routes.deckSearch(forSaleFilters)

        return (
            <div style={{margin: spacing(2), marginTop: spacing(4), display: "flex", justifyContent: "center"}}>
                <Card style={{padding: spacing(2), maxWidth: 400}}>
                    <Box mb={2}>
                        <Typography variant={"h4"} color={"primary"} style={{margin: spacing(0, 0, 2, 0)}}>{profile.username}</Typography>
                        <SellerRatingView sellerId={profile.id} sellerName={profile.username}/>
                    </Box>

                    {profile.searchResult != null && (
                        <>
                            <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                            <Box
                                display={"grid"}
                                gridGap={spacing(1)}
                                gridTemplateRows={"1fr 1fr 1fr 1fr"}
                                gridTemplateColumns={"1fr 1fr 1fr 1fr"}
                                alignItems={"center"}
                            >
                                <Count name={"Decks"} count={profile.searchResult.deckCount}/>
                                <Count name={"For Sale"} count={profile.searchResult.forSaleCount}/>
                                <Count name={"Top 10 SAS"} count={profile.searchResult.topSasAverage}/>
                                <Count name={"High SAS"} count={profile.searchResult.highSas}/>
                                <Count name={"Power"} count={profile.searchResult.totalPower}/>
                                <Count name={"Chains"} count={profile.searchResult.totalChains}/>
                                <Count name={"Mavericks"} count={profile.searchResult.mavericks}/>
                                <Count name={"Anomalies"} count={profile.searchResult.anomalies}/>
                            </Box>
                        </>
                    )}

                    <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                    <Typography color={"textSecondary"} variant={"subtitle2"}>Public Contact Info</Typography>

                    {!profile.publicContactInfo && !profile.sellerEmail && !profile.discord && (
                        <Typography style={{marginTop: spacing(1)}}>None available</Typography>
                    )}

                    {profile.publicContactInfo && (
                        <Typography style={{whiteSpace: "pre-wrap", marginTop: spacing(1)}}>{profile.publicContactInfo}</Typography>
                    )}
                    {profile.sellerEmail && (
                        <Box mt={2}>
                            <Link href={`mailto:${profile.sellerEmail}`}>{profile.sellerEmail}</Link>
                        </Box>
                    )}
                    {profile.discord && (
                        <DiscordUser style={{marginTop: spacing(2)}} discord={profile.discord}/>
                    )}
                    <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>

                    {profile.allowUsersToSeeDeckOwnership && (
                        <LinkButton color={"primary"} href={decksLink}>
                            {profile.username}'s Decks
                        </LinkButton>
                    )}
                    <LinkButton color={"primary"} href={forSaleLink}>
                        {profile.username}'s Decks for Sale
                    </LinkButton>
                </Card>
            </div>
        )
    }
}

const Count = (props: { name: string, count: number }) => (
    <>
        <Typography variant={"overline"}>{props.name}</Typography>
        <Typography variant={"body2"}>{props.count}</Typography>
    </>
)
