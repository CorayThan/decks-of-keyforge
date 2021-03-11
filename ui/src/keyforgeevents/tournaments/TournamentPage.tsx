import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { log, roundToHundreds, Utils } from "../../config/Utils"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { TournamentPairingInfo } from "../../generated-src/TournamentPairingInfo"
import { TournamentRanking } from "../../generated-src/TournamentRanking"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { SortableTable, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { LoaderBar } from "../../mui-restyled/Loader"
import { uiStore } from "../../ui/UiStore"
import { UserSearchSuggest } from "../../user/search/UserSearchSuggest"
import { UserLink } from "../../user/UserLink"
import { userStore } from "../../user/UserStore"
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

    const {name, organizerUsernames, rankings, rounds, tourneyId, joined, privateTournament, stage} = info

    useEffect(() => {
        uiStore.setTopbarValues(name, name, "A KeyForge tournament")
    }, [name])

    const username = userStore.username
    const isOrganizer = username != null && organizerUsernames.includes(username)

    const canJoin = !privateTournament && !joined && !isOrganizer && username != null

    log.info("rankings count " + rankings.length)

    let pairMessage = "Pair Next Round"
    if (stage === TournamentStage.TOURNAMENT_NOT_STARTED) {
        pairMessage = "Pair First Round"
    } else if (stage === TournamentStage.PAIRING_IN_PROGRESS) {
        pairMessage = "Repair Round"
    }

    return (
        <Box p={2} display={"flex"} alignItems={"center"} flexDirection={"column"}>
            {canJoin && (
                <Box display={"flex"} justifyContent={"center"} mb={2}>
                    <Button
                        size={"large"}
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => tournamentStore.addParticipant(tourneyId, username!)}
                    >
                        Join this Tournament!
                    </Button>
                </Box>
            )}
            <Typography color={"primary"} variant={"h4"} style={{marginBottom: spacing(2)}}>{Utils.enumNameToReadable(stage)}</Typography>
            {isOrganizer && (
                <Paper>
                    <Box p={2} display={"flex"} flexWrap={"wrap"}>
                        <Box mr={2}>
                            <Button
                                variant={"contained"}
                                onClick={() => tournamentStore.pairNextRound(tourneyId)}
                                disabled={stage === TournamentStage.GAMES_IN_PROGRESS || stage === TournamentStage.TOURNAMENT_COMPLETE}
                            >
                                {pairMessage}
                            </Button>
                        </Box>
                        <Box mr={2}>
                            <Button
                                variant={"contained"}
                                onClick={() => tournamentStore.startCurrentRound(tourneyId)}
                                disabled={stage !== TournamentStage.PAIRING_IN_PROGRESS}
                            >
                                Lock Pairings and Start Round
                            </Button>
                        </Box>
                        <Box mr={2}>
                            <Button
                                variant={"contained"}
                                onClick={() => tournamentStore.startCurrentRound(tourneyId)}
                                disabled={stage !== TournamentStage.VERIFYING_ROUND_RESULTS}
                            >
                                End Tournament
                            </Button>
                        </Box>
                        {stage === TournamentStage.TOURNAMENT_NOT_STARTED && (
                            <Box width={280} mr={2}>
                                <UserSearchSuggest
                                    placeholderText={"Add participant with username..."}
                                    onClick={(username) => tournamentStore.addParticipant(tourneyId, username)}
                                />
                            </Box>
                        )}
                    </Box>
                </Paper>
            )}

            <Box>
                {rounds.map(round => (
                    <Box mt={2} key={round.roundId}>
                        <Paper>
                            <Box p={2}>
                                <Typography variant={"h5"}>Round {round.roundNumber} Pairings</Typography>
                            </Box>
                            <SortableTable
                                headers={roundPairingsTableHeaders(tourneyId, stage, isOrganizer, username)}
                                data={round.pairings}
                                defaultSort={"playerOneUsername"}
                            />
                            {round.pairings.length === 0 && (
                                <Box p={2}>
                                    <Typography color={"textSecondary"}>This round has not yet been paired.</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                ))}
            </Box>

            <Box mt={2}>
                <Paper>
                    <Box p={2}>
                        <Typography variant={"h5"}>Players</Typography>
                    </Box>
                    <SortableTable
                        headers={participantResultsTableHeaders(tourneyId, isOrganizer, username)}
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
            </Box>
        </Box>
    )
})

const participantResultsTableHeaders = (id: number, isOrganizer: boolean, username?: string): SortableTableHeaderInfo<TournamentRanking>[] => {

    return [
        {property: "ranking", sortable: true},
        {property: "username", sortable: true, transform: (data) => <UserLink username={data.username}/>},
        {property: "wins", sortable: true},
        {property: "losses", sortable: true},
        {property: "byes", sortable: true},
        {property: "strengthOfSchedule", title: "SOS", sortable: true, transform: data => roundToHundreds(data.strengthOfSchedule)},
        {property: "extendedStrengthOfSchedule", title: "Extended SOS", sortable: true, transform: data => roundToHundreds(data.extendedStrengthOfSchedule)},
        {property: "keys", sortable: true},
        {property: "opponentKeys", sortable: true},
        {
            title: "Dropped",
            transform: (data) => {
                if (data.dropped) {
                    return "Dropped"
                }
                if (!isOrganizer && username != data.username) {
                    return null
                }
                return (
                    <Button
                        onClick={() => tournamentStore.dropParticipant(id, data.username)}
                    >
                        Drop
                    </Button>
                )
            }
        },

    ]
}

const roundPairingsTableHeaders = (tourneyId: number, stage: TournamentStage, isOrganizer: boolean, username?: string): SortableTableHeaderInfo<TournamentPairingInfo>[] => {

    return [
        {
            property: "playerOneUsername",
            title: "Player One",
            sortable: true,
            transform: (data) => {
                return (
                    <UserLink username={data.playerOneUsername}/>
                )
            }
        },
        {property: "playerOneKeys", title: "Keys", sortable: true},
        {
            property: "playerTwoUsername",
            title: "Player Two",
            sortable: true,
            transform: (data) => {
                if (data.playerTwoUsername == null) {
                    return "Bye"
                }
                return (
                    <UserLink username={data.playerTwoUsername}/>
                )
            }
        },
        {property: "playerTwoKeys", title: "Keys", sortable: true},
        {
            property: "playerOneWon",
            title: "Winner",
            sortable: false,
            transform: (data) => {
                if (data.playerOneWon === true) {
                    return data.playerOneUsername
                } else if (data.playerOneWon === false) {
                    return data.playerTwoUsername
                } else {
                    return ""
                }
            }
        },
        {property: "tcoLink", sortable: false},
        {
            transform: (data) => {

                if (username == null || (!isOrganizer && !(username === data.playerOneUsername || username === data.playerTwoUsername))) {
                    return null
                }
                if (data.playerTwoUsername == null) {
                    return null
                }
                return (
                    <ReportResults
                        tourneyId={tourneyId}
                        pairingId={data.pairId}
                        update={data.playerOneWon != null}
                        playerOne={data.playerOneUsername}
                        playerTwo={data.playerTwoUsername!}
                    />
                )
            }
        },

    ]
}

class ResultsStore {
    @observable
    open = false

    @observable
    playerOneWon = true

    @observable
    playerOneKeys = 0

    @observable
    playerTwoKeys = 0

    openResults = () => {
        this.open = true
        this.playerOneWon = true
        this.playerOneKeys = 0
        this.playerTwoKeys = 0
    }

    close = () => this.open = false

    constructor() {
        makeObservable(this)
    }
}

const resultsStore = new ResultsStore()

const ReportResults = observer((props: { tourneyId: number, pairingId: number, update: boolean, playerOne: string, playerTwo: string }) => {
    const {tourneyId, pairingId, update, playerOne, playerTwo} = props

    const resultName = update ? "Update Results" : "Report Results"
    return (
        <>
            <Button onClick={resultsStore.openResults}>
                {resultName}
            </Button>
            <Dialog open={resultsStore.open} onClose={resultsStore.close}>
                <DialogTitle>{resultName} for {playerOne} and {playerTwo ?? "Bye"}</DialogTitle>

                <DialogContent>
                    <FormControl style={{marginRight: spacing(2)}}>
                        <FormLabel>Winner</FormLabel>
                        <RadioGroup value={resultsStore.playerOneWon} onChange={event => resultsStore.playerOneWon = event.target.value === "true"}>
                            <FormControlLabel value={true} control={<Radio/>} label={playerOne}/>
                            <FormControlLabel value={false} control={<Radio/>} label={playerTwo}/>
                        </RadioGroup>
                    </FormControl>
                    <FormControl style={{marginRight: spacing(2)}}>
                        <FormLabel>{playerOne} Keys</FormLabel>
                        <RadioGroup value={resultsStore.playerOneKeys} onChange={event => resultsStore.playerOneKeys = Number(event.target.value)}>
                            <FormControlLabel value={0} control={<Radio/>} label={"Zero Keys"}/>
                            <FormControlLabel value={1} control={<Radio/>} label={"One Key"}/>
                            <FormControlLabel value={2} control={<Radio/>} label={"Two Keys"}/>
                            <FormControlLabel value={3} control={<Radio/>} label={"Three Keys"}/>
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>{playerTwo} Keys</FormLabel>
                        <RadioGroup value={resultsStore.playerTwoKeys} onChange={event => resultsStore.playerTwoKeys = Number(event.target.value)}>
                            <FormControlLabel value={0} control={<Radio/>} label={"Zero Keys"}/>
                            <FormControlLabel value={1} control={<Radio/>} label={"One Key"}/>
                            <FormControlLabel value={2} control={<Radio/>} label={"Two Keys"}/>
                            <FormControlLabel value={3} control={<Radio/>} label={"Three Keys"}/>
                        </RadioGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={resultsStore.close}>Cancel</Button>
                    <KeyButton
                        color={"primary"}
                        onClick={async () => {
                            await tournamentStore.reportResults(tourneyId, {
                                pairingId,
                                playerOneWon: resultsStore.playerOneWon,
                                playerOneKeys: resultsStore.playerOneKeys,
                                playerTwoKeys: resultsStore.playerTwoKeys,
                            })
                            resultsStore.close()
                        }}
                        loading={tournamentStore.reportingResults}
                    >
                        Report
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </>
    )
})
