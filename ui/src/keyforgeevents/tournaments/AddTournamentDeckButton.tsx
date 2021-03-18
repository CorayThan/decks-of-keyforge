import { Box, TextField } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { Utils } from "../../config/Utils"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { tournamentStore } from "./TournamentStore"

export const AddTournamentDeckButton = observer((props: { eventId: number, username: string }) => {

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
                    disabled={tournamentStore.addingDeck || deckId.trim().length === 0}
                >
                    Add Deck
                </KeyButton>
            </Box>
        </Box>
    )
})
