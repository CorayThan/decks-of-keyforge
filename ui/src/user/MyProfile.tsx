import { Button, CardActions, Checkbox, FormControlLabel } from "@material-ui/core"
import TextField from "@material-ui/core/es/TextField"
import Typography from "@material-ui/core/Typography"
import { observable } from "mobx"
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

    @observable
    contactInfo: string
    @observable
    allowUsersToSeeDeckOwnership: boolean

    constructor(props: MyProfileInnerProps) {
        super(props)
        const {publicContactInfo, allowUsersToSeeDeckOwnership} = props.profile
        this.contactInfo = publicContactInfo ? publicContactInfo : ""
        this.allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership
    }

    updateProfile = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        UserStore.instance.updateUserProfile({
            publicContactInfo: this.contactInfo.trim().length === 0 ? undefined : this.contactInfo.trim(),
            allowUsersToSeeDeckOwnership: this.allowUsersToSeeDeckOwnership
        })
    }

    render() {
        const profile = this.props.profile
        const filters = new DeckFilters()
        filters.owner = profile.username
        const decksLink = Routes.deckSearch(filters.prepareForQueryString())
        let shareLinkDescription
        if (this.allowUsersToSeeDeckOwnership) {
            shareLinkDescription = "Use this link to share your deck list and decks for sale and trade with other users."
        } else {
            shareLinkDescription = "Use this link to share your decks for sale and trade with other users."
        }
        return (
            <div style={{marginTop: spacing(2), display: "flex", justifyContent: "center"}}>
                <form onSubmit={this.updateProfile}>
                    <KeyCard
                        topContents={(
                            <div>
                                <Typography variant={"h4"} style={{color: "#FFFFFF", marginBottom: spacing(1)}}>{profile.username}</Typography>
                                <Typography style={{color: "#FFFFFF"}}>{profile.email}</Typography>
                            </div>
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
                            <Typography style={{marginBottom: spacing(2), marginTop: spacing(2)}}>
                                {shareLinkDescription}
                            </Typography>
                            <LinkButton color={"primary"} to={decksLink}>
                                {profile.username}'s Decks
                            </LinkButton>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.allowUsersToSeeDeckOwnership}
                                        onChange={(event) => this.allowUsersToSeeDeckOwnership = event.target.checked}
                                        tabIndex={6}
                                    />
                                }
                                label={"Allow anyone to see which decks I own"}
                            />
                            <CardActions
                                style={{paddingLeft: 0}}
                            >
                                <div style={{flexGrow: 1}}/>
                                <Button
                                    variant={"contained"}
                                    type={"submit"}
                                >
                                    Save
                                </Button>
                            </CardActions>
                        </div>
                    </KeyCard>
                </form>
            </div>
        )
    }
}
