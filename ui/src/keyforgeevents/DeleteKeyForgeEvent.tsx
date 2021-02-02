import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { KeyForgeEventDto } from "../generated-src/KeyForgeEventDto"
import { KeyButton } from "../mui-restyled/KeyButton"
import { keyForgeEventStore } from "./KeyForgeEventStore"

export const DeleteKeyForgeEvent = observer((props: { event: KeyForgeEventDto }) => {
    const {event} = props

    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
            >
                Delete
            </Button>
            <Dialog
                open={open}
            >
                <DialogTitle>Delete {event.name}?</DialogTitle>
                <DialogContent>
                   <DialogContentText>Are you sure you want to delete this event?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <KeyButton
                        onClick={() => setOpen(false)}
                        disabled={keyForgeEventStore.deletingEvent}
                    >
                        Cancel
                    </KeyButton>
                    <KeyButton
                        color={"primary"}
                        loading={keyForgeEventStore.deletingEvent}
                        onClick={async () => {
                            await keyForgeEventStore.deleteEvent(event.id!)
                            setOpen(false)
                        }}
                    >
                        Delete
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </>
    )
})
