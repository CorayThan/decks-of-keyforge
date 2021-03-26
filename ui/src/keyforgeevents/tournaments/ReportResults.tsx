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
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { spacing } from "../../config/MuiConfig"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { tournamentStore } from "./TournamentStore"

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

export const ReportResults = observer((props: {
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
                    <Box>
                        {store.error.length > 0 && <Typography color={"error"} style={{marginBottom: spacing(2)}}>{store.error}</Typography>}
                        <FormControl style={{marginRight: spacing(2)}}>
                            <FormLabel>Winner</FormLabel>
                            <RadioGroup value={store.playerOneWon} onChange={event => store.playerOneWon = event.target.value === "true"}>
                                <Box display={"flex"}>
                                    <FormControlLabel value={true} control={<Radio/>} label={playerOne} style={{marginRight: spacing(4)}}/>
                                    <FormControlLabel value={false} control={<Radio/>} label={playerTwo}/>
                                </Box>
                            </RadioGroup>
                        </FormControl>
                        <Box display={"flex"} mt={2}>
                            <FormControl style={{marginRight: spacing(2)}}>
                                <FormLabel>{playerOne}'s Score</FormLabel>
                                <RadioGroup value={store.playerOneScore} onChange={event => store.playerOneScore = Number(event.target.value)}>
                                    <FormControlLabel value={0} control={<Radio/>} label={"Zero"}/>
                                    <FormControlLabel value={1} control={<Radio/>} label={"One"}/>
                                    <FormControlLabel value={2} control={<Radio/>} label={"Two"}/>
                                    <FormControlLabel value={3} control={<Radio/>} label={"Three"}/>
                                </RadioGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>{playerTwo}'s Score</FormLabel>
                                <RadioGroup value={store.playerTwoScore} onChange={event => store.playerTwoScore = Number(event.target.value)}>
                                    <FormControlLabel value={0} control={<Radio/>} label={"Zero"}/>
                                    <FormControlLabel value={1} control={<Radio/>} label={"One"}/>
                                    <FormControlLabel value={2} control={<Radio/>} label={"Two"}/>
                                    <FormControlLabel value={3} control={<Radio/>} label={"Three"}/>
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Box>
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
