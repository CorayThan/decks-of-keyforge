import { Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { spacing } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { PairingStrategy, PairingStrategyUtils } from "../../generated-src/PairingStrategy"
import { TournamentPairingPlayers } from "../../generated-src/TournamentPairingPlayers"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { UserLink } from "../../user/UserLink"
import { tournamentStore } from "./TournamentStore"

export const PairPlayersButton = observer((props: {
    tourneyId: number, stage: TournamentStage, pairingStrategy: PairingStrategy, pairingOptions: PairingInfo[]
}) => {
    const {tourneyId, stage, pairingStrategy, pairingOptions} = props

    let pairMessage = "Pair Next Round"
    if (stage === TournamentStage.TOURNAMENT_NOT_STARTED) {
        pairMessage = "Pair First Round"
    } else if (stage === TournamentStage.PAIRING_IN_PROGRESS) {
        pairMessage = "Redo pairings"
    }

    const [store] = useState(new PairPlayersStore(pairingOptions))
    const [pairingStrat, setPairingStrategy] = useState(pairingStrategy)

    if (store.pairManually) {
        return (
            <Grid item={true} xs={12}>
                <Box>
                    <Typography variant={"h6"}>Current pairings</Typography>
                    {store.manualPairings.map(pairing => {
                        const firstPlayer = pairingOptions.find(option => option.participantId === pairing.playerOneId)?.username ?? "No first player"
                        const secondPlayer = pairingOptions.find(option => option.participantId === pairing.playerTwoId)?.username
                        let secondPlayerNode
                        if (pairing.bye) {
                            secondPlayerNode = <Typography variant={"subtitle2"}>Bye</Typography>
                        } else if (secondPlayer == null) {
                            secondPlayerNode = <Typography variant={"subtitle2"}>???</Typography>
                        } else {
                            secondPlayerNode = <UserLink username={secondPlayer}/>
                        }
                        return (
                            <Box display={"flex"} alignItems={"center"} mt={2}>
                                <UserLink username={firstPlayer}/>
                                <Typography variant={"subtitle2"} style={{marginLeft: spacing(2), marginRight: spacing(2)}}>vs</Typography>
                                {secondPlayerNode}
                            </Box>
                        )
                    })}
                    <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>

                    <Typography variant={"h6"}>To be paired</Typography>
                    <Box display={"flex"} flexWrap={"wrap"} pt={2}>
                        {store.unpaired.map(toPair => (
                            <Button
                                key={toPair.participantId}
                                variant={"outlined"}
                                onClick={() => {
                                    store.pairNext(toPair)
                                }}
                                style={{marginRight: spacing(2), marginBottom: spacing(2)}}
                            >
                                {toPair.username}
                            </Button>
                        ))}
                        <Button
                            variant={"outlined"}
                            onClick={() => {
                                store.pairNext(undefined)
                            }}
                            style={{marginRight: spacing(2), marginBottom: spacing(2)}}
                        >
                            Bye
                        </Button>
                    </Box>

                    <Box display={"flex"}>
                        <Button
                            variant={"contained"}
                            onClick={store.stopPairingManually}
                            style={{marginRight: spacing(2)}}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={"primary"}
                            variant={"contained"}
                            onClick={async () => {
                                await tournamentStore.pairNextRound(tourneyId, store.manualPairings)
                                store.stopPairingManually()
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
                    onClick={() => {
                        if (pairingStrategy === PairingStrategy.MANUAL_PAIRING) {
                            store.pairManually = true
                        } else {
                            tournamentStore.pairNextRound(tourneyId)
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
                        {PairingStrategyUtils.values.map(strat =>
                            <MenuItem key={strat} value={strat}>{Utils.enumNameToReadable(strat)}</MenuItem>
                        )}
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

    pairNext = (info?: PairingInfo) => {
        let addId: number | undefined
        if (info != null) {
            Utils.removeFromArray(this.unpaired, info)
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
            pairing.playerTwoId = addId
            if (addId == null) {
                pairing.bye = true
            }
        }
    }

    stopPairingManually = () => {
        this.pairManually = false
        this.manualPairings = []
        this.unpaired.push(...this.paired)
        this.paired = []
    }

    constructor(pairingOptions: PairingInfo[]) {
        makeObservable(this)
        this.unpaired = pairingOptions
    }
}

interface PairingInfo {
    participantId: number
    username: string
}