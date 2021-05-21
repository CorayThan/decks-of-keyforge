import { Box, IconButton } from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { DeckOwnershipButton } from "../../decks/ownership/DeckOwnershipButton"
import { PastSasButton } from "../../decks/PastSasButton"
import { TournamentDeckInfo } from "../../generated-src/TournamentDeckInfo"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { SortableTable, SortableTableContainer, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { HouseBanner } from "../../houses/HouseBanner"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { UserLink } from "../../user/UserLink"
import { AddTournamentDeckButton } from "./AddTournamentDeckButton"
import { tournamentStore } from "./TournamentStore"

export const TournamentDecksList = (props: {
    tourneyId: number, stage: TournamentStage, isOrganizer: boolean, deckChoicesLocked: boolean,
    organizerAddedDecksOnly: boolean, decks: TournamentDeckInfo[], username?: string
}) => {

    const {tourneyId, stage, isOrganizer, decks, username, deckChoicesLocked, organizerAddedDecksOnly} = props

    return (
        <SortableTableContainer
            title={`Player Decks`}
            controls={(
                <>
                    {!organizerAddedDecksOnly && !deckChoicesLocked && username != null && !isOrganizer && stage === TournamentStage.TOURNAMENT_NOT_STARTED && (
                        <AddTournamentDeckButton eventId={tourneyId} username={username}/>
                    )}
                    <LinkButton href={Routes.tournamentDecksSearch(tourneyId)} newWindow={true} style={{marginLeft: spacing(2)}}>View Decks</LinkButton>
                </>
            )}
        >
            <SortableTable
                headers={playerDecksTableHeaders(tourneyId, isOrganizer)}
                data={decks}
                defaultSort={"username"}
            />
        </SortableTableContainer>
    )
}

const playerDecksTableHeaders = (tourneyId: number, isTo: boolean): SortableTableHeaderInfo<TournamentDeckInfo>[] => {

    const headers: SortableTableHeaderInfo<TournamentDeckInfo>[] = [
        {
            property: "username",
            title: "Player",
            transform: deck => <UserLink username={deck.username}/>
        },
        {
            property: "name",
            title: "Deck",
            transform: deck => (
                <KeyLink style={{color: themeStore.defaultTextColor}} noStyle={true} to={Routes.deckPage(deck.keyforgeId)} newWindow={true}>
                    {deck.name}
                </KeyLink>
            )
        },
        {
            property: "houses",
            sortable: false,
            transform: deck => (
                <Box width={140}>
                    <HouseBanner houses={deck.houses} size={36}/>
                </Box>
            )
        },
        {
            property: "sas",
            title: "SAS",
            transform: deck => (
                <Box display={"flex"} alignItems={"center"}>
                    {deck.sas}
                    <PastSasButton name={deck.name} deckId={deck.id} style={{marginLeft: spacing(2)}}/>
                </Box>
            )
        },
        {
            property: "hasVerificationImage",
            title: "Image",
            transform: deck => (<DeckOwnershipButton deckName={deck.name} deckId={deck.id} hasVerification={deck.hasVerificationImage}/>)
        }
    ]

    if (isTo) {
        headers.push(
            {
                title: "Remove",
                transform: deck => (
                    <IconButton
                        onClick={async () => {
                            await tournamentStore.removeDeck(tourneyId, deck.tournamentDeckId)
                        }}
                        disabled={tournamentStore.addingDeck}
                    >
                        <Delete/>
                    </IconButton>
                )
            }
        )
    }

    return headers

}
