import { Box, Button, Grid, Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { spacing, themeStore } from "../../config/MuiConfig"
import { TextConfig } from "../../config/TextConfig"
import { TimeUtils } from "../../config/TimeUtils"
import { Utils } from "../../config/Utils"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { ConfirmKeyButton, KeyButton } from "../../mui-restyled/KeyButton"
import { LoaderBar } from "../../mui-restyled/Loader"
import { uiStore } from "../../ui/UiStore"
import { UserSearchSuggest } from "../../user/search/UserSearchSuggest"
import { UserLink } from "../../user/UserLink"
import { userStore } from "../../user/UserStore"
import { KeyForgeEventCard } from "../KeyForgeEventCard"
import { PairingsView } from "./PairingsView"
import { PairPlayersButton } from "./PairPlayersButton"
import { TournamentDecksList } from "./TournamentDecksList"
import { TournamentPlayerRankings } from "./TournamentPlayerRankings"
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

    const {
        name, organizerUsernames, rankings, rounds, tourneyId, joined, pairingStrategy, roundEndsAt,
        privateTournament, stage, tournamentDecks, registrationClosed, deckChoicesLocked, event
    } = info

    useEffect(() => {
        uiStore.setTopbarValues(name, name, "A KeyForge tournament")
    }, [name])

    const username = userStore.username
    const isOrganizer = username != null && organizerUsernames.includes(username)

    const canJoin = !privateTournament && !joined && !isOrganizer && username != null && !registrationClosed

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
                        <Typography color={themeStore.darkMode ? "secondary" : "primary"} variant={"h4"}>
                            {Utils.enumNameToReadable(stage)}
                        </Typography>
                    </Grid>
                    {isOrganizer && (
                        <Grid item={true} xs={12}>
                            <Box display={"flex"}>
                                <Paper style={{padding: spacing(2)}}>
                                    <Grid container={true} spacing={2} alignItems={"center"}>
                                        {stage === TournamentStage.TOURNAMENT_NOT_STARTED && (
                                            <>
                                                {!privateTournament && (
                                                    <Grid item={true}>
                                                        <Button
                                                            variant={"contained"}
                                                            onClick={() => tournamentStore.lockRegistration(tourneyId, !registrationClosed)}
                                                        >
                                                            {registrationClosed ? "Unlock Registration" : "Lock Registration"}
                                                        </Button>
                                                    </Grid>
                                                )}
                                                <Grid item={true}>
                                                    <Button
                                                        variant={"contained"}
                                                        onClick={() => tournamentStore.lockRegistration(tourneyId, !registrationClosed)}
                                                    >
                                                        {deckChoicesLocked ? "Unlock Deck Registration" : "Lock Deck Registration"}
                                                    </Button>
                                                </Grid>
                                            </>
                                        )}
                                        <PairPlayersButton
                                            tourneyId={tourneyId}
                                            stage={stage}
                                            pairingStrategy={pairingStrategy}
                                            pairingOptions={rankings.map(ranking => ({participantId: ranking.participantId, username: ranking.username}))}
                                        />
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
                        <>
                            <PairingsView
                                round={currentRound}
                                tourneyId={tourneyId}
                                stage={stage}
                                isOrganizer={isOrganizer}
                                containsDecks={tournamentDecks.length > 0}
                                username={username}
                            />
                            <RoundTimer endTime={roundEndsAt} duration={event.minutesPerRound}/>
                        </>
                    )}

                    <Grid item={true} xs={12}>
                        <TournamentPlayerRankings
                            tourneyId={tourneyId}
                            isOrganizer={isOrganizer}
                            stage={stage}
                            rankings={rankings}
                        />
                    </Grid>

                    {pastRounds.map((round) => (
                        <PairingsView
                            key={round.roundNumber}
                            round={round}
                            tourneyId={tourneyId}
                            stage={stage}
                            isOrganizer={isOrganizer}
                            containsDecks={tournamentDecks.length > 0}
                            username={username}
                        />
                    ))}

                    {tournamentDecks.length > 0 && (
                        <Grid item={true} xs={12}>
                            <Box display={"flex"}>
                                <TournamentDecksList
                                    tourneyId={tourneyId}
                                    decks={tournamentDecks}
                                    isOrganizer={isOrganizer}
                                    stage={stage}
                                    username={username}
                                    deckChoicesLocked={deckChoicesLocked}
                                />
                            </Box>
                        </Grid>
                    )}

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
                                            <Box mr={2} key={username}>
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

const RoundTimer = (props: { duration?: number, endTime?: string }) => {
    const {duration, endTime} = props
    if (endTime == null || duration == null) {
        return null
    }

    const [timer, setTimer] = useState(TimeUtils.countDownTo(endTime))

    useEffect(() => {

        const timeoutId = window.setInterval(() => {
            setTimer(TimeUtils.countDownTo(endTime))
        }, 1000)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [endTime])

    return (
        <Grid item={true}>
            <Paper>
                <Box display={"flex"} alignItems={"flex-end"} flexDirection={"column"} p={2}>
                    <Box flexGrow={1}/>
                    <Typography variant={"subtitle2"}>{duration} min per round</Typography>
                    <Typography variant={"subtitle2"}>Started at {TimeUtils.countdownStartReadable(endTime, duration)}</Typography>
                    <Typography variant={"h2"} style={{fontFamily: TextConfig.MONOTYPE, fontWeight: 500}}>{timer}</Typography>
                </Box>
            </Paper>
        </Grid>
    )
}
