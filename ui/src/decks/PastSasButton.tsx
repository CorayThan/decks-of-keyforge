import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper } from "@material-ui/core"
import HistoryIcon from "@material-ui/icons/History"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { roundToHundreds } from "../config/Utils"
import { SortableTable } from "../generic/SortableTable"
import { Loader } from "../mui-restyled/Loader"
import { deckStore } from "./DeckStore"

export const PastSasButton = observer((props: { name: string, deckId: number, size?: "small" | "medium", color?: string, style?: React.CSSProperties }) => {
    const {name, size, deckId, color, style} = props

    const [open, setOpen] = useState<boolean>(false)

    const pastSas = deckStore.pastSas

    return (
        <div style={style}>
            <IconButton
                size={size}
                onClick={() => {
                    setOpen(true)
                    deckStore.findPastSas(deckId)
                }}
            >
                <HistoryIcon style={{color, width: 20, height: 20}}/>
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
                                        {property: "amberControl", transform: pastSas => roundToHundreds(pastSas.amberControl)},
                                        {property: "expectedAmber", transform: pastSas => roundToHundreds(pastSas.expectedAmber)},
                                        {property: "artifactControl", transform: pastSas => roundToHundreds(pastSas.artifactControl)},
                                        {property: "creatureControl", transform: pastSas => roundToHundreds(pastSas.creatureControl)},
                                        {property: "effectivePower", transform: pastSas => roundToHundreds(pastSas.effectivePower)},
                                        {property: "efficiency", transform: pastSas => roundToHundreds(pastSas.efficiency)},
                                        {property: "recursion", transform: pastSas => roundToHundreds(pastSas.recursion)},
                                        {property: "disruption", transform: pastSas => roundToHundreds(pastSas.disruption)},
                                        {property: "creatureProtection", transform: pastSas => roundToHundreds(pastSas.creatureProtection)},
                                        {property: "other", transform: pastSas => roundToHundreds(pastSas.other)},
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
