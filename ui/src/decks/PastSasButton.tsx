import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper } from "@material-ui/core"
import HistoryIcon from "@material-ui/icons/History"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { SortableTable } from "../generic/SortableTable"
import { Loader } from "../mui-restyled/Loader"
import { deckStore } from "./DeckStore"

export const PastSasButton = observer((props: { name: string, deckId: number }) => {
    const {name, deckId} = props

    const [open, setOpen] = useState<boolean>(false)

    const pastSas = deckStore.pastSas

    return (
        <div>
            <IconButton
                size={"small"}
                onClick={() => {
                    setOpen(true)
                    deckStore.findPastSas(deckId)
                }}
            >
                <HistoryIcon style={{color: "#FFFFFF", width: 20, height: 20}}/>
            </IconButton>
            {open && (
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <DialogTitle>Past SAS for {name}</DialogTitle>
                    <DialogContent>
                        {pastSas == null ? (
                            <Loader/>
                        ) : (
                            <Paper style={{overflowX: "auto"}}>
                                <SortableTable
                                    headers={[
                                        {property: "updateDate"},
                                        {property: "sasRating"},
                                        {property: "aercScore"},
                                        {property: "synergyRating"},
                                        {property: "antisynergyRating"},
                                        {property: "amberControl"},
                                        {property: "expectedAmber"},
                                        {property: "artifactControl"},
                                        {property: "creatureControl"},
                                        {property: "effectivePower"},
                                        {property: "efficiency"},
                                        {property: "recursion"},
                                        {property: "disruption"},
                                        {property: "creatureProtection"},
                                        {property: "other"},
                                    ]}
                                    data={pastSas}
                                    defaultSort={"updateDate"}
                                />
                            </Paper>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    )
})
