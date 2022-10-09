import {ConfirmKeyButton} from "../../mui-restyled/KeyButton";
import {theoreticalDeckStore} from "./TheoreticalDeckStore";
import {observer} from "mobx-react"
import React from "react"
import {useHistory} from "react-router-dom";

export const DeleteTheoreticalDeckButton = observer((props: { deckId: string, deckName: string }) => {

    const history = useHistory()

    return (
        <ConfirmKeyButton
            title={`Really delete ${props.deckName}?`}
            onConfirm={async () => {
                await theoreticalDeckStore.deleteTheoryDeck(props.deckId)
                history.go(0)
            }}
            color={"primary"}
            description={"You will be permanently deleting this imaginary deck. But you can always make it again!"}
        >
            Delete
        </ConfirmKeyButton>
    )
})
