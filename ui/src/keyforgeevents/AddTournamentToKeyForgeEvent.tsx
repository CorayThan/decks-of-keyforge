import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Routes } from "../config/Routes"
import { KeyForgeEventDto } from "../generated-src/KeyForgeEventDto"
import { KeyButton } from "../mui-restyled/KeyButton"
import { tournamentStore } from "./tournaments/TournamentStore"

export const AddTournamentToKeyForgeEvent = observer((props: { event: KeyForgeEventDto }) => {
    const {event} = props

    const [open, setOpen] = useState(false)

    const history = useHistory()

    if (event.tourneyId != null) {
        return null
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
            >
                Add Tournament
            </Button>
            <Dialog
                open={open}
            >
                <DialogTitle>Create Tournament for this event?</DialogTitle>
                <DialogContent>
                   <DialogContentText>
                       This will allow you to manage this tournament on DoK. If it is private only the TO will be able to add players.
                   </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <KeyButton
                        onClick={() => setOpen(false)}
                        disabled={tournamentStore.creatingTourney}
                    >
                        Cancel
                    </KeyButton>
                    <KeyButton
                        loading={tournamentStore.creatingTourney}
                        onClick={async () => {
                            const tourneyId = await tournamentStore.createTourney(event.id!, true)
                            history.push(Routes.tournamentPage(tourneyId))
                            setOpen(false)
                        }}
                    >
                        Create Private Tournament
                    </KeyButton>
                    <KeyButton
                        color={"primary"}
                        loading={tournamentStore.creatingTourney}
                        onClick={async () => {
                            const tourneyId = await tournamentStore.createTourney(event.id!, false)
                            history.push(Routes.tournamentPage(tourneyId))
                            setOpen(false)
                        }}
                    >
                        Create Public Tournament
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </>
    )
})
