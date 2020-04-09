import { Link, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths, Routes } from "../config/Routes"
import { MyTeamPage } from "./MyTeamPage"
import { TeamInvitesPage } from "./TeamInvitesPage"
import { teamStore } from "./TeamStore"

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
            <Typography style={{marginTop: spacing(4)}}>
                Being part of a team allows you to search decks owned by your team if you are a $1+ a
                month <Link href={AboutSubPaths.patreon}>Patron</Link>,
                and shows your team on the <Link href={Routes.users}>user search page</Link>.
            </Typography>
        </div>
    )
})
