import { Card, Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { LinkButton } from "../mui-restyled/LinkButton"
import { UserStore } from "./UserStore"

@observer
export class MyProfile extends React.Component {

    render() {
        const profile = UserStore.instance.userProfile!
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
                            <Typography>You don't have any public info.</Typography>
                        )
                    }
                    <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                    <Typography style={{marginBottom: spacing(2)}}>
                        Use this link to view and share your deck list.
                    </Typography>
                    <LinkButton color={"primary"} to={decksLink}>
                        {profile.username}'s Decks
                    </LinkButton>
                </Card>
            </div>
        )
    }
}
