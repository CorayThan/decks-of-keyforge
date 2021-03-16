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
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import { Star } from "@material-ui/icons"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { roundToHundreds, Utils } from "../../config/Utils"
import { MiniDeckLink } from "../../decks/buttons/MiniDeckLink"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { TournamentPairingInfo } from "../../generated-src/TournamentPairingInfo"
import { TournamentRanking } from "../../generated-src/TournamentRanking"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { SortableTable, SortableTableContainer, SortableTableHeaderInfo } from "../../generic/SortableTable"
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

    const {name, organizerUsernames, rankings, rounds, tourneyId, joined, privateTournament, stage, containsDecks} = info

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

                    {rounds.map((round, idx) => (
                        <Grid item={true} xs={12} xl={6} key={round.roundId}>
                            <Box maxWidth={880}>
                                <SortableTableContainer title={`Round ${round.roundNumber} Pairings`}>
                                    <SortableTable
                                        headers={roundPairingsTableHeaders(
                                            tourneyId,
                                            stage,
                                            isOrganizer,
                                            stage !== TournamentStage.PAIRING_IN_PROGRESS || idx !== rounds.length - 1,
                                            containsDecks,
                                            username,
                                        )}
                                        data={round.pairings}
                                        defaultSort={"table"}
                                    />
                                    {round.pairings.length === 0 && (
                                        <Box p={2}>
                                            <Typography color={"textSecondary"}>This round has not yet been paired.</Typography>
                                        </Box>
                                    )}
                                </SortableTableContainer>
                            </Box>
                        </Grid>
                    ))}

                    <Grid item={true} xs={12}>
                        <Paper>
                            <Box p={2}>
                                <Typography variant={"h5"}>Player Rankings</Typography>
                            </Box>
                            <SortableTable
                                headers={participantResultsTableHeaders(tourneyId, isOrganizer, stage, containsDecks, username)}
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
                </Grid>
            </Box>
        </Box>
    )
})

const roundPairingsTableHeaders = (
    tourneyId: number, stage: TournamentStage, isOrganizer: boolean, reportAvailable: boolean, containsDecks: boolean, username?: string
): SortableTableHeaderInfo<TournamentPairingInfo>[] => {

    return [
        {property: "table", sortable: true},
        {
            property: "playerOneUsername",
            title: "Player One",
            sortable: true,
            transform: (data) => {
                return (
                    <BoxScore username={data.playerOneUsername} winner={data.playerOneWon === true}/>
                )
            }
        },
        {property: "playerOneWins", title: "Wins"},
        {
            property: "playerTwoUsername",
            title: "Player Two",
            sortable: true,
            transform: (data) => {
                if (data.playerTwoUsername == null) {
                    return "Bye"
                }
                return (
                    <BoxScore username={data.playerTwoUsername} winner={data.playerOneWon === false}/>
                )
            }
        },
        {property: "playerTwoWins", title: "Wins"},
        {
            transform: (data) => {

                if (!reportAvailable) {
                    return null
                }
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

const participantResultsTableHeaders = (id: number, isOrganizer: boolean, stage: TournamentStage, containsDecks: boolean, username?: string): SortableTableHeaderInfo<TournamentRanking>[] => {

    const columns: SortableTableHeaderInfo<TournamentRanking>[] = [
        {property: "ranking", title: "Rank", sortable: true},
        {property: "username", sortable: true, transform: (data) => <UserLink username={data.username}/>},
        {property: "wins", sortable: true},
        {property: "losses", sortable: true},
        {property: "byes", sortable: true},
        {property: "strengthOfSchedule", title: "SOS", sortable: true, transform: data => roundToHundreds(data.strengthOfSchedule)},
        {property: "extendedStrengthOfSchedule", title: "SOS+", sortable: true, transform: data => roundToHundreds(data.extendedStrengthOfSchedule)},
        {property: "score", sortable: true},
        {property: "opponentsScore", title: "Opp. Score", sortable: true},
    ]

    if (stage === TournamentStage.TOURNAMENT_NOT_STARTED) {
        columns.push(
            {
                title: "Add Deck",
                transform: (data) => {
                    if (!isOrganizer && username != data.username) {
                        return null
                    }
                    return <AddDeckButton eventId={id} username={data.username}/>
                }
            },
        )
    }

    if (containsDecks) {
        columns.push(
            {
                title: "Decks",
                transform: (data) => {
                    return (
                        <Box>
                            {data.decks.map(deck => (
                                <MiniDeckLink deck={deck}/>
                            ))}
                        </Box>
                    )
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

const BoxScore = (props: { username: string, winner?: boolean }) => {
    return (
        <Box display={"flex"} alignItems={"center"}>
            <UserLink username={props.username}/>
            {props.winner && <Star color={"primary"} style={{marginLeft: spacing(1)}}/>}
        </Box>
    )
}

class ResultsStore {
    @observable
    open = false

    @observable
    playerOneWon = true

    @observable
    playerOneScore = 0

    @observable
    playerTwoScore = 0

    @observable
    error = ""

    openResults = () => {
        this.open = true
        this.playerOneWon = true
        this.playerOneScore = 0
        this.playerTwoScore = 0
        this.error = ""
    }

    constructor() {
        makeObservable(this)
    }

    validate = () => {
        if ((this.playerOneWon && this.playerOneScore < this.playerTwoScore) || (this.playerOneWon && this.playerOneScore < this.playerTwoScore)) {
            this.error = "Loser should not have higher score."
            return false
        }
        return true
    }
}

const ReportResults = observer((props: {
    tourneyId: number,
    pairingId: number,
    update: boolean,
    playerOne: string,
    playerTwo: string,
}) => {
    const {tourneyId, pairingId, update, playerOne, playerTwo} = props

    const [store] = useState(new ResultsStore())

    const resultName = update ? "Update" : "Report"

    return (
        <>
            <Button
                size={"small"}
                onClick={store.openResults}
            >
                {resultName}
            </Button>
            <Dialog open={store.open} onClose={() => store.open = false}>
                <DialogTitle>{resultName} for {playerOne} and {playerTwo ?? "Bye"}</DialogTitle>

                <DialogContent>
                    {store.error.length > 0 && <Typography color={"error"} style={{marginBottom: spacing(2)}}>{store.error}</Typography>}
                    <FormControl style={{marginRight: spacing(2)}}>
                        <FormLabel>Winner</FormLabel>
                        <RadioGroup value={store.playerOneWon} onChange={event => store.playerOneWon = event.target.value === "true"}>
                            <FormControlLabel value={true} control={<Radio/>} label={playerOne}/>
                            <FormControlLabel value={false} control={<Radio/>} label={playerTwo}/>
                        </RadioGroup>
                    </FormControl>
                    <FormControl style={{marginRight: spacing(2)}}>
                        <FormLabel>{playerOne} Score</FormLabel>
                        <RadioGroup value={store.playerOneScore} onChange={event => store.playerOneScore = Number(event.target.value)}>
                            <FormControlLabel value={0} control={<Radio/>} label={"Zero"}/>
                            <FormControlLabel value={1} control={<Radio/>} label={"One"}/>
                            <FormControlLabel value={2} control={<Radio/>} label={"Two"}/>
                            <FormControlLabel value={3} control={<Radio/>} label={"Three"}/>
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>{playerTwo} Score</FormLabel>
                        <RadioGroup value={store.playerTwoScore} onChange={event => store.playerTwoScore = Number(event.target.value)}>
                            <FormControlLabel value={0} control={<Radio/>} label={"Zero"}/>
                            <FormControlLabel value={1} control={<Radio/>} label={"One"}/>
                            <FormControlLabel value={2} control={<Radio/>} label={"Two"}/>
                            <FormControlLabel value={3} control={<Radio/>} label={"Three"}/>
                        </RadioGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => store.open = false}>Cancel</Button>
                    <KeyButton
                        color={"primary"}
                        onClick={async () => {
                            if (store.validate()) {
                                await tournamentStore.reportResults(tourneyId, {
                                    pairingId,
                                    playerOneWon: store.playerOneWon,
                                    playerOneScore: store.playerOneScore,
                                    playerTwoScore: store.playerTwoScore,
                                })
                                store.open = false
                            }
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

const AddDeckButton = observer((props: { eventId: number, username: string }) => {

    const [deckId, setDeckId] = useState("")
    return (
        <Box display={"flex"} alignItems={"center"}>
            <TextField
                value={deckId}
                onChange={event => setDeckId(event.target.value)}
                label={"Deck ID / URL"}
                style={{width: 120}}
            />
            <Box ml={1}>
                <KeyButton
                    onClick={async () => {
                        const deckUuid = Utils.findUuid(deckId)
                        await tournamentStore.addDeck(props.eventId, deckUuid, props.username)
                        setDeckId("")
                    }}
                    size={"small"}
                    loading={tournamentStore.addingDeck}
                >
                    Add Deck
                </KeyButton>
            </Box>
        </Box>
    )
})
