import { Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { spacing } from "../../config/MuiConfig"
import { PairingStrategy } from "../../generated-src/PairingStrategy"
import { TournamentPairingPlayers } from "../../generated-src/TournamentPairingPlayers"
import { TournamentRanking } from "../../generated-src/TournamentRanking"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { UserLink } from "../../user/UserLink"
import { tournamentStore } from "./TournamentStore"
import { ArrayUtils } from "../../config/ArrayUtils";

export const PairPlayersButton = observer((props: {
    tourneyId: number, stage: TournamentStage, pairingStrategy: PairingStrategy, rankings: TournamentRanking[]
}) => {
    const {tourneyId, stage, pairingStrategy, rankings} = props

    let pairMessage = "Pair Next Round"
    if (stage === TournamentStage.TOURNAMENT_NOT_STARTED) {
        pairMessage = "Pair First Round"
    } else if (stage === TournamentStage.PAIRING_IN_PROGRESS) {
        pairMessage = "Redo pairings"
    }

    const [pairingStrat, setPairingStrategy] = useState(pairingStrategy)


    if (pairPlayersStore.pairManually) {
        return (
            <Grid item={true} xs={12}>
                <Box>
                    <Typography variant={"h6"}>Current pairings</Typography>
                    {pairPlayersStore.manualPairings.map(pairing => {
                        const firstPlayer = pairPlayersStore.findFirstPlayerName(pairing.playerOneId)
                        const secondPlayer = pairPlayersStore.findSecondPlayerName(pairing.playerTwoId)
                        let secondPlayerNode
                        if (pairing.bye) {
                            secondPlayerNode = <Typography variant={"subtitle2"}>Bye</Typography>
                        } else if (secondPlayer == null) {
                            secondPlayerNode = <Typography variant={"subtitle2"}>???</Typography>
                        } else {
                            secondPlayerNode = <UserLink username={secondPlayer}/>
                        }
                        return (
                            <Box display={"flex"} alignItems={"center"} mt={2} key={pairing.pairingTable}>
                                <UserLink username={firstPlayer}/>
                                <Typography variant={"subtitle2"}
                                            style={{marginLeft: spacing(2), marginRight: spacing(2)}}>vs</Typography>
                                {secondPlayerNode}
                            </Box>
                        )
                    })}
                    <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>

                    <Typography variant={"h6"}>To be paired</Typography>
                    <Box display={"flex"} flexWrap={"wrap"} pt={2}>
                        {pairPlayersStore.unpaired.map(toPair => (
                            <Button
                                key={toPair.participantId}
                                variant={"outlined"}
                                onClick={() => {
                                    pairPlayersStore.pairNext(toPair)
                                }}
                                style={{marginRight: spacing(2), marginBottom: spacing(2)}}
                            >
                                {toPair.username}
                            </Button>
                        ))}
                        <Button
                            variant={"outlined"}
                            onClick={() => {
                                pairPlayersStore.pairNext(undefined)
                            }}
                            disabled={!pairPlayersStore.canAddBye()}
                            style={{marginRight: spacing(2), marginBottom: spacing(2)}}
                        >
                            Bye
                        </Button>
                    </Box>

                    <Box display={"flex"}>
                        <Button
                            variant={"contained"}
                            onClick={pairPlayersStore.stopPairingManually}
                            style={{marginRight: spacing(2)}}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={"primary"}
                            variant={"contained"}
                            onClick={async () => {
                                await tournamentStore.pairNextRound(tourneyId, pairPlayersStore.manualPairings)
                                pairPlayersStore.stopPairingManually()
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Grid>
        )
    }

    return (
        <>
            <Grid item={true}>
                <Button
                    variant={"contained"}
                    onClick={async () => {
                        if (pairingStrategy === PairingStrategy.MANUAL_PAIRING) {
                            await tournamentStore.findTourneyInfo(tourneyId)
                            pairPlayersStore.startPairingManually(rankings)
                        } else {
                            await tournamentStore.pairNextRound(tourneyId)
                        }
                    }}
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
                <FormControl style={{minWidth: 160}}>
                    <InputLabel id="demo-simple-select-label">Pairing Strategy</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        value={pairingStrat}
                        onChange={event => {
                            const newStrat = event.target.value as PairingStrategy
                            setPairingStrategy(newStrat)
                            tournamentStore.changePairingStrategy(tourneyId, newStrat)
                        }}
                    >
                        <MenuItem value={PairingStrategy.SWISS_SOS}>Swiss SOS</MenuItem>
                        <MenuItem value={PairingStrategy.SWISS_RANDOM}>Swiss Survival</MenuItem>
                        <MenuItem value={PairingStrategy.MANUAL_PAIRING}>Manual Pairing</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </>
    )
})

class PairPlayersStore {
    @observable
    pairManually = false

    @observable
    manualPairings: TournamentPairingPlayers[] = []

    @observable
    unpaired: PairingInfo[] = []

    @observable
    paired: PairingInfo[] = []

    @observable
    pairingOptions: PairingInfo[] = []

    pairNext = (info?: PairingInfo) => {
        let addId: number | undefined
        if (info != null) {
            ArrayUtils.removeFromArray(this.unpaired, info)
            this.paired.push(info)
            addId = info.participantId
        }
        const pairing = this.manualPairings[this.manualPairings.length - 1]

        if (pairing == null || pairing.bye || pairing.playerTwoId != null) {
            const nextPairing = {
                pairingTable: this.manualPairings.length + 1,
                playerOneId: addId!,
                bye: false
            }
            this.manualPairings.push(nextPairing)
        } else {
            if (addId == null) {
                pairing.bye = true
            }
            pairing.playerTwoId = addId
        }
    }

    findFirstPlayerName = (id: number) => {
        return this.pairingOptions.find(option => option.participantId === id)?.username ?? "No first player"
    }

    findSecondPlayerName = (id: number | undefined) => {
        return this.pairingOptions.find(option => option.participantId === id)?.username
    }

    canAddBye = () => {
        const pairing = this.manualPairings[this.manualPairings.length - 1]
        return pairing != null && pairing.playerTwoId == null && !pairing.bye
    }

    stopPairingManually = () => {
        this.pairManually = false
        this.manualPairings = []
        this.unpaired.push(...this.paired)
        this.paired = []
        this.pairingOptions = []
    }

    constructor() {
        makeObservable(this)
    }

    startPairingManually = (rankings: TournamentRanking[]) => {
        this.pairingOptions = rankings.map(ranking => ({
            participantId: ranking.participantId,
            username: ranking.username
        }))
        this.unpaired = this.pairingOptions.slice()
        this.paired = []
        this.manualPairings = []
        this.pairManually = true
    }
}

const pairPlayersStore = new PairPlayersStore()

interface PairingInfo {
    participantId: number
    username: string
}
