import { Divider } from "@material-ui/core"
import TextField from "@material-ui/core/es/TextField"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { KeyCard } from "../generic/KeyCard"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { UserProfile } from "./UserProfile"
import { UserStore } from "./UserStore"

@observer
export class MyProfile extends React.Component {
    render() {
        const profile = UserStore.instance.userProfile
        if (!profile) {
            return <Loader/>
        }
        return <MyProfileInner profile={profile}/>
    }
}

interface MyProfileInnerProps {
    profile: UserProfile
}

@observer
class MyProfileInner extends React.Component<MyProfileInnerProps> {

    contactInfo: string
    allowUsersToSeeDecks: boolean

    constructor(props: MyProfileInnerProps) {
        super(props)
        const {publicContactInfo, allowUsersToSeeDeckOwnership} = props.profile
        this.contactInfo = publicContactInfo ? publicContactInfo : ""
        this.allowUsersToSeeDecks = allowUsersToSeeDeckOwnership
    }


    render() {
        const profile = UserStore.instance.userProfile!
        const filters = new DeckFilters()
        filters.owner = profile.username
        const decksLink = Routes.deckSearch(filters.prepareForQueryString())
        return (
            <div style={{marginTop: spacing(2), display: "flex", justifyContent: "center"}}>
                <KeyCard
                    topContents={(
                        <Typography variant={"h4"} style={{color: "#FFFFFF"}}>{profile.username}</Typography>
                    )}
                    style={{maxWidth: 400}}
                >
                    <div style={{padding: spacing(2)}}>
                        {
                            <TextField
                                label={"Public contact and trade info"}
                                value={this.contactInfo}
                                multiline={true}
                                rows={4}
                                onChange={(event) => this.contactInfo = event.target.value}
                                fullWidth={true}
                            />

                        }
                        <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                        <Typography style={{marginBottom: spacing(2)}}>
                            Use this link to view and share your deck list.
                        </Typography>
                        <LinkButton color={"primary"} to={decksLink}>
                            {profile.username}'s Decks
                        </LinkButton>
                    </div>
                </KeyCard>
            </div>
        )
    }
}
