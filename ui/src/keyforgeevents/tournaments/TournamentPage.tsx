import { Box, Button, Grid, Paper, Typography } from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { roundToHundreds, Utils } from "../../config/Utils"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { TournamentRanking } from "../../generated-src/TournamentRanking"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { SortableTable, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { ConfirmKeyButton, KeyButton } from "../../mui-restyled/KeyButton"
import { LoaderBar } from "../../mui-restyled/Loader"
import { uiStore } from "../../ui/UiStore"
import { UserSearchSuggest } from "../../user/search/UserSearchSuggest"
import { UserLink } from "../../user/UserLink"
import { userStore } from "../../user/UserStore"
import { KeyForgeEventCard } from "../KeyForgeEventCard"
import { AddTournamentDeckButton } from "./AddTournamentDeckButton"
import { PairingsView } from "./PairingsView"
import { TournamentDecksList } from "./TournamentDecksList"
import { tournamentStore } from "./TournamentStore"

export const TournamentPage = observer(() => {

    const {id} = useParams<{ id: string }>()

    useEffect(() => {
        tournamentStore.tournamentInfo = undefined
        tournamentStore.findTourneyInfo(Number(id))
    }, [id])

    const info = tournamentStore.tournamentInfo

    return (
        <>
            <LoaderBar show={tournamentStore.loadingTournament}/>
            {info != null && (
                <TournamentView info={info}/>
            )}
        </>
    )
})

const TournamentView = observer((props: { info: TournamentInfo }) => {
    const {info} = props

    const {name, organizerUsernames, rankings, rounds, tourneyId, joined, privateTournament, stage, tournamentDecks, event} = info

    useEffect(() => {
        uiStore.setTopbarValues(name, name, "A KeyForge tournament")
    }, [name])

    const username = userStore.username
    const isOrganizer = username != null && organizerUsernames.includes(username)

    const canJoin = !privateTournament && !joined && !isOrganizer && username != null

    let pairMessage = "Pair Next Round"
    if (stage === TournamentStage.TOURNAMENT_NOT_STARTED) {
        pairMessage = "Pair First Round"
    } else if (stage === TournamentStage.PAIRING_IN_PROGRESS) {
        pairMessage = "Redo pairings"
    }

    const currentRound = rounds.length > 0 ? rounds[rounds.length - 1] : undefined
    const pastRounds = rounds.length > 1 ? rounds.slice(0, rounds.length - 1) : []

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <Box width={1632} padding={2} style={{overflowX: "hidden"}}>
                <Grid container={true} spacing={2}>
                    {canJoin && (
                        <Grid item={true} xs={12}>
                            <Button
                                size={"large"}
                                color={"primary"}
                                variant={"contained"}
                                onClick={() => tournamentStore.addParticipant(tourneyId, username!)}
                            >
                                Join this Tournament!
                            </Button>
                        </Grid>
                    )}
                    <Grid item={true} xs={12}>
                        <Typography color={"primary"} variant={"h4"}>{Utils.enumNameToReadable(stage)}</Typography>
                    </Grid>
                    {isOrganizer && (
                        <Grid item={true} xs={12}>
                            <Box display={"flex"}>
                                <Paper style={{padding: spacing(2)}}>
                                    <Grid container={true} spacing={2}>
                                        <Grid item={true}>
                                            <Button
                                                variant={"contained"}
                                                onClick={() => tournamentStore.pairNextRound(tourneyId)}
                                                disabled={stage === TournamentStage.GAMES_IN_PROGRESS || stage === TournamentStage.TOURNAMENT_COMPLETE}
                                            >
                                                {pairMessage}
                                            </Button>
                                        </Grid>
                                        <Grid item={true}>
                                            <Button
                                                variant={"contained"}
                                                onClick={() => tournamentStore.startCurrentRound(tourneyId)}
                                                disabled={stage !== TournamentStage.PAIRING_IN_PROGRESS}
                                            >
                                                Lock Pairings and Start Round
                                            </Button>
                                        </Grid>
                                        <Grid item={true}>
                                            <KeyButton
                                                variant={"contained"}
                                                onClick={() => tournamentStore.endTournament(tourneyId, stage === TournamentStage.VERIFYING_ROUND_RESULTS)}
                                                disabled={stage !== TournamentStage.VERIFYING_ROUND_RESULTS && stage !== TournamentStage.TOURNAMENT_COMPLETE}
                                                loading={tournamentStore.endingTournament}
                                            >
                                                {stage === TournamentStage.TOURNAMENT_COMPLETE ? "Reopen Tournament" : "End Tournament"}
                                            </KeyButton>
                                        </Grid>
                                        {stage === TournamentStage.TOURNAMENT_NOT_STARTED && (
                                            <Grid item={true}>
                                                <Box width={280}>
                                                    <UserSearchSuggest
                                                        placeholderText={"Add participant with username..."}
                                                        onClick={(username) => tournamentStore.addParticipant(tourneyId, username)}
                                                    />
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>
                            </Box>
                        </Grid>
                    )}

                    {currentRound != null && (
                        <PairingsView
                            round={currentRound}
                            tourneyId={tourneyId}
                            stage={stage}
                            isOrganizer={isOrganizer}
                            containsDecks={tournamentDecks.length > 0}
                            username={username}
                        />
                    )}

                    <Grid item={true} xs={12}>
                        <Paper>
                            <Box p={2}>
                                <Typography variant={"h5"}>Player Rankings</Typography>
                            </Box>
                            <SortableTable
                                headers={participantResultsTableHeaders(tourneyId, isOrganizer, stage, tournamentDecks.length > 0, username)}
                                data={rankings}
                                defaultSort={"ranking"}
                                rowBackgroundColor={(ranking) => {
                                    if (ranking.dropped) {
                                        return red["100"]
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
                    </Grid>

                    {pastRounds.map((round) => (
                        <PairingsView
                            round={round}
                            tourneyId={tourneyId}
                            stage={stage}
                            isOrganizer={isOrganizer}
                            containsDecks={tournamentDecks.length > 0}
                            username={username}
                        />
                    ))}

                    <Grid item={true} xs={12}>
                        <Box display={"flex"}>
                            <TournamentDecksList tourneyId={tourneyId} decks={tournamentDecks} isOrganizer={isOrganizer} stage={stage} username={username}/>
                        </Box>
                    </Grid>

                    <Grid item={true} xs={12}>
                        <Box display={"flex"}>
                            <KeyForgeEventCard event={event} style={{marginRight: spacing(2)}} noTournamentLink={true}/>
                            <Paper>
                                <Box p={2}>
                                    <Typography variant={"h5"}>Tournament Organizers</Typography>
                                    {isOrganizer && (
                                        <Box width={280} mt={2}>
                                            <UserSearchSuggest
                                                placeholderText={"Add TO with username..."}
                                                onClick={(username) => tournamentStore.addTO(tourneyId, username)}
                                            />
                                        </Box>
                                    )}
                                    <Box display={"flex"} flexWrap={"wrap"} mt={2}>
                                        {organizerUsernames.map(username => (
                                            <Box mr={2}>
                                                <UserLink username={username}/>
                                                {isOrganizer && organizerUsernames.length > 1 && (
                                                    <ConfirmKeyButton
                                                        title={"Remove Tournament Organizer"}
                                                        description={`Do you want to remove ${username} from having admin rights to this tournament?`}
                                                        onConfirm={() => tournamentStore.removeTo(tourneyId, username)}
                                                        style={{marginLeft: spacing(2)}}
                                                    >
                                                        Remove TO
                                                    </ConfirmKeyButton>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
})

const participantResultsTableHeaders = (id: number, isOrganizer: boolean, stage: TournamentStage, containsDecks: boolean, username?: string): SortableTableHeaderInfo<TournamentRanking>[] => {

    const columns: SortableTableHeaderInfo<TournamentRanking>[] = [
        {property: "ranking", title: "Rank", sortable: true},
        {property: "username", title: "Player", transform: (data) => <UserLink username={data.username}/>},
        {property: "wins", sortable: true},
        {property: "losses", sortable: true},
        {property: "byes", sortable: true},
        {property: "strengthOfSchedule", title: "SOS", sortable: true, transform: data => roundToHundreds(data.strengthOfSchedule)},
        {property: "extendedStrengthOfSchedule", title: "SOS+", sortable: true, transform: data => roundToHundreds(data.extendedStrengthOfSchedule)},
        {property: "score", sortable: true},
        {property: "opponentsScore", title: "Opp. Score", sortable: true},
    ]

    if (stage === TournamentStage.TOURNAMENT_NOT_STARTED && isOrganizer) {
        columns.push(
            {
                title: "Add Deck",
                transform: (data) => {
                    return <AddTournamentDeckButton eventId={id} username={data.username}/>
                }
            },
        )
    }

    if (isOrganizer) {
        columns.push(
            {
                title: "",
                transform: (data) => {
                    return (
                        <Button
                            onClick={() => tournamentStore.dropParticipant(id, data.username, !data.dropped)}
                            size={"small"}
                        >
                            {data.dropped ? "Undrop" : "Drop"}
                        </Button>
                    )
                }
            },
        )
    }

    return columns
}
