import { Box, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { spacing } from "../config/MuiConfig"
import { LinkButtonSafe } from "../mui-restyled/LinkButton"
import { TeamIcon } from "./TeamIcon"
import { teamStore } from "./TeamStore"

export const TeamBadge = observer((props: { teamId: string, style?: React.CSSProperties }) => {
    const {teamId, style} = props

    if (!teamStore.teamNamesLoaded) {
        return null
    }

    const team = teamStore.teamNames.get(teamId)

    if (team == null) {
        return null
    }

    const contents = (
        <Box display={"flex"} alignItems={"center"} maxWidth={178}>
            {team.teamImg != null && <TeamIcon teamImg={team.teamImg} style={{marginRight: spacing(2)}}/>}
            <Typography variant={"body2"} align={"left"}>{team.name}</Typography>
        </Box>
    )

    if (team.homepage == null) {
        return (
            <Box style={style}>
                {contents}
            </Box>
        )
    }

    return (
        <LinkButtonSafe href={team.homepage} style={style} noCaps={true}>
            {contents}
        </LinkButtonSafe>
    )
})
