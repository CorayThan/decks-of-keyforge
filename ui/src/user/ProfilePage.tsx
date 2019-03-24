import { Card, Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log } from "../config/Utils"
import { DeckFilters, prepareDeckFiltersForQueryString } from "../decks/search/DeckFilters"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { UserProfile } from "./UserProfile"
import { UserStore } from "./UserStore"

interface ProfilePageProps extends RouteComponentProps<{ username: string }> {
}

export class ProfilePage extends React.Component<ProfilePageProps> {
    render() {
        log.info(`Rendering profile page with user name ${this.props.match.params.username}`)
        return <ProfileContainer username={this.props.match.params.username} />
    }
}

interface ProfileContainerProps {
    username: string
}

@observer
export class ProfileContainer extends React.Component<ProfileContainerProps> {

    constructor(props: ProfileContainerProps) {
        super(props)
        UserStore.instance.userProfile = undefined
        UiStore.instance.setTopbarValues("Profile", "Profile", "")
    }

    componentDidMount(): void {
        UserStore.instance.findUserProfile(this.props.username)
    }

    componentWillReceiveProps(nextProps: Readonly<ProfileContainerProps>): void {
        log.info(`Profile will receive props next username: ${nextProps.username} this ${this.props.username}`)
        if (this.props.username !== nextProps.username) {
            UserStore.instance.findUserProfile(nextProps.username)
        }
    }

    render() {
        const profile = UserStore.instance.userProfile
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
        UiStore.instance.setTopbarValues(`${props.profile.username}'s Profile`, props.profile.username, "")
    }

    render() {
        const profile = this.props.profile

        const filters = new DeckFilters()
        filters.owner = profile.username

        const decksLink = Routes.deckSearch(prepareDeckFiltersForQueryString(filters))
        return (
            <div style={{margin: spacing(2), marginTop: spacing(4), display: "flex", justifyContent: "center"}}>
                <Card style={{padding: spacing(2), maxWidth: 400}}>
                    <Typography variant={"h4"} color={"primary"} style={{marginBottom: spacing(2)}}>{profile.username}</Typography>
                    {
                        profile.publicContactInfo ? (
                            <Typography style={{whiteSpace: "pre-wrap"}}>{profile.publicContactInfo}</Typography>
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
