import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { deckStore } from "../decks/DeckStore"
import { UserLink } from "../user/UserLink"

export const OwnersList = (props: { owners?: string[] }) => {

    const owners = props.owners
    if (!owners || owners.length === 0) {
        return null
    }

    const teamSearch = deckStore.currentFilters?.teamDecks === true

    return (
        <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(1)}}>
            {owners.map(owner => {
                return (
                    <UserLink username={owner} style={{marginRight: spacing(2)}}/>
                )
            })}
        </div>
    )
}
