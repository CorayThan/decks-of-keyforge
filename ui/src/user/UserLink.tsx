import { observer } from "mobx-react"
import React from "react"
import { Routes } from "../config/Routes"
import { LinkButton } from "../mui-restyled/LinkButton"
import { TeamIcon } from "../teams/TeamIcon"
import { teamStore } from "../teams/TeamStore"

export const UserLink = observer((props: { username: string, plain?: boolean, style?: React.CSSProperties }) => {
    const {username, plain, style} = props

    const team = teamStore.userToTeam.get(username)

    return (
        <LinkButton
            newWindow={true}
            href={Routes.userProfilePage(username)}
            endIcon={team && <TeamIcon teamImg={team.teamImg}/>}
            style={{textTransform: "none", ...style}}
            variant={plain ? undefined : "outlined"}
            size={"small"}
        >
            {username}
        </LinkButton>
    )
})
