import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { AboutSubPaths, Routes } from "../config/Routes"
import { MyTeamPage } from "./MyTeamPage"
import { TeamInvitesPage } from "./TeamInvitesPage"
import { teamStore } from "./TeamStore"
import { DokLink } from "../generic/DokLink"

export const TeamPage = observer(() => {

    useEffect(() => {
        teamStore.findTeamInfo()
    }, [])

    const {teamOrInvites} = teamStore

    if (teamOrInvites == null) {
        return null
    }

    const {team, invites} = teamOrInvites

    return (
        <div>
            {team == null ? (
                <TeamInvitesPage invites={invites}/>
            ) : (
                <MyTeamPage team={team}/>
            )}
            <Typography color={themeStore.darkMode ? "textSecondary" : undefined} variant={"body2"} style={{marginTop: spacing(4)}}>
                Being part of a team allows you to search decks owned by your team if you are a $3+ a
                month <DokLink href={AboutSubPaths.patreon}>Patron</DokLink>,
                and shows your team on the <DokLink href={Routes.users}>user search page</DokLink>.
            </Typography>
            <Typography variant={"body2"} style={{marginTop: spacing(1)}}>
                If your deck list is private, team members will be able to view it, but other site users will not.
            </Typography>
        </div>
    )
})
