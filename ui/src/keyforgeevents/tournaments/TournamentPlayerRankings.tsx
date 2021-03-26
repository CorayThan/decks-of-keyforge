import { Box, Button, IconButton, Paper, TextField, Typography } from "@material-ui/core"
import { blue, green, red } from "@material-ui/core/colors"
import { Check, Clear, Edit } from "@material-ui/icons"
import * as React from "react"
import { useState } from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { roundToHundreds } from "../../config/Utils"
import { TournamentRanking } from "../../generated-src/TournamentRanking"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { SortableTable, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { UserLink } from "../../user/UserLink"
import { AddTournamentDeckButton } from "./AddTournamentDeckButton"
import { tournamentStore } from "./TournamentStore"

export const TournamentPlayerRankings = (props: {
    tourneyId: number, isOrganizer: boolean, stage: TournamentStage, rankings: TournamentRanking[]
}) => {
    const {tourneyId, isOrganizer, stage, rankings} = props

    return (
        <Paper>
            <Box p={2}>
                <Typography variant={"h5"}>Player Rankings</Typography>
            </Box>
            <SortableTable
                headers={participantResultsTableHeaders(tourneyId, isOrganizer, stage)}
                data={rankings}
                defaultSort={"ranking"}
                rowBackgroundColor={(ranking) => {
                    if (stage === TournamentStage.TOURNAMENT_NOT_STARTED && ranking.verified) {
                        return themeStore.darkMode ? green["900"] : green["100"]
                    }
                    if (ranking.dropped) {
                        return themeStore.darkMode ? blue["900"] : red["100"]
                    }
                    return undefined
                }}
                defaultSortDir={"asc"}
            />
            {rankings.length === 0 && (
                <Box p={2}>
                    <Typography color={"textSecondary"}>No players have joined this tournament yet.</Typography>
                </Box>
            )}
        </Paper>
    )
}


const participantResultsTableHeaders = (id: number, isOrganizer: boolean, stage: TournamentStage): SortableTableHeaderInfo<TournamentRanking>[] => {

    const columns: SortableTableHeaderInfo<TournamentRanking>[] = [
        {property: "ranking", title: "Rank", sortable: true, padding: "checkbox"},
        {
            property: "username",
            title: "Player",
            transform: (data) => {
                return (
                    <DisplayTournamentUser isOrganizer={isOrganizer} username={data.username} tourneyId={id}/>
                )
            },
        },
        {property: "wins", sortable: true, padding: "checkbox"},
        {property: "losses", sortable: true, padding: "checkbox"},
        {property: "byes", sortable: true, padding: "checkbox"},
        {property: "strengthOfSchedule", title: "SOS", sortable: true, transform: data => roundToHundreds(data.strengthOfSchedule), padding: "checkbox"},
        {
            property: "extendedStrengthOfSchedule",
            title: "SOS+",
            sortable: true,
            transform: data => roundToHundreds(data.extendedStrengthOfSchedule),
            padding: "checkbox"
        },
        {property: "score", sortable: true, padding: "checkbox"},
        {property: "opponentsScore", title: "Opp. Score", sortable: true, padding: "checkbox"},
    ]

    if (isOrganizer) {
        columns.push(
            {
                title: "Add Deck",
                transform: (data) => {
                    return <AddTournamentDeckButton eventId={id} username={data.username}/>
                }
            },
        )
        columns.push(
            {
                title: "",
                transform: (data) => {
                    return (
                        <>
                            {stage === TournamentStage.TOURNAMENT_NOT_STARTED && (
                                <Button
                                    onClick={() => tournamentStore.verifyParticipant(id, data.username, !data.verified)}
                                    size={"small"}
                                >
                                    {data.verified ? "Unverify" : "Verify"}
                                </Button>
                            )}
                            <Button
                                onClick={() => tournamentStore.dropParticipant(id, data.username, !data.dropped)}
                                size={"small"}
                            >
                                {data.dropped ? "Undrop" : "Drop"}
                            </Button>
                        </>
                    )
                }
            },
        )
    }

    columns.push(
        {property: "discord", sortable: true}
    )
    columns.push(
        {property: "tcoUsername", title: "TCO", sortable: true}
    )

    return columns
}

const DisplayTournamentUser = (props: { isOrganizer: boolean, username: string, tourneyId: number }) => {
    const {isOrganizer, username, tourneyId} = props
    const link = <UserLink username={username}/>
    if (!isOrganizer) {
        return link
    }

    const [edit, setEdit] = useState(false)
    const [changeUsernameTo, setChangeUsernameTo] = useState(username)

    return (
        <>
            {edit ? (
                <Box display={"flex"}>
                    <TextField
                        label={"Change user to"}
                        value={changeUsernameTo}
                        onChange={event => setChangeUsernameTo(event.target.value)}
                    />
                    <IconButton
                        onClick={async () => {
                            await tournamentStore.changeTournamentParticipant(tourneyId, username, changeUsernameTo.trim())
                            setEdit(false)
                        }}
                        style={{marginLeft: spacing(1)}}
                    >
                        <Check/>
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setChangeUsernameTo(username)
                            setEdit(false)
                        }}
                    >
                        <Clear/>
                    </IconButton>
                </Box>
            ) : (
                <Box display={"flex"}>
                    {link}
                    <IconButton
                        onClick={() => {
                            setChangeUsernameTo(username)
                            setEdit(!edit)
                        }}
                        size={"small"}
                        style={{marginLeft: spacing(1)}}
                    >
                        <Edit fontSize={"small"}/>
                    </IconButton>
                </Box>
            )}
        </>
    )
}
