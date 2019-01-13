import { Card, Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { MyProfile } from "./MyProfile"
import { UserStore } from "./UserStore"

interface ProfilePageProps extends RouteComponentProps<{ username: string }> {
}

@observer
export class ProfilePage extends React.Component<ProfilePageProps> {

    constructor(props: ProfilePageProps) {
        super(props)
        UserStore.instance.userProfile = undefined
    }

    componentDidMount(): void {
        UserStore.instance.findUserProfile(this.props.match.params.username)
        UiStore.instance.setTopbarValues("Profile")
    }

    render() {
        const profile = UserStore.instance.userProfile
        if (!profile) {
            return <Loader/>
        }

        if (UserStore.instance.user && UserStore.instance.user.username === profile.username) {
            return <MyProfile/>
        }

        const filters = new DeckFilters()
        filters.owner = profile.username
        const decksLink = Routes.deckSearch(filters.prepareForQueryString())
        return (
            <div style={{margin: spacing(2), marginTop: spacing(4), display: "flex", justifyContent: "center"}}>
                <Card style={{padding: spacing(2), maxWidth: 400}}>
                    <Typography variant={"h4"} color={"primary"} style={{marginBottom: spacing(2)}}>{profile.username}</Typography>
                    {
                        profile.publicContactInfo ? (
                            <Typography>{profile.publicContactInfo}</Typography>
                        ) : (
                            <Typography>{profile.username} doesn't have any public info.</Typography>
                        )
                    }
                    <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                    <LinkButton color={"primary"} to={decksLink}>
                        {profile.username}'s {profile.allowUsersToSeeDeckOwnership ? "" : "For Sale or Trade "}Decks
                    </LinkButton>
                </Card>
            </div>
        )
    }
}
