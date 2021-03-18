import { Box } from "@material-ui/core"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { DeckOwnershipButton } from "../../decks/ownership/DeckOwnershipButton"
import { PastSasButton } from "../../decks/PastSasButton"
import { DeckFilters } from "../../decks/search/DeckFilters"
import { TournamentDeckInfo } from "../../generated-src/TournamentDeckInfo"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { SortableTable, SortableTableContainer, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { HouseBanner } from "../../houses/HouseBanner"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { UserLink } from "../../user/UserLink"
import { AddTournamentDeckButton } from "./AddTournamentDeckButton"

export const TournamentDecksList = (props: { tourneyId: number, stage: TournamentStage, isOrganizer: boolean, decks: TournamentDeckInfo[], username?: string }) => {
    const {tourneyId, stage, isOrganizer, decks, username} = props
    const filters = new DeckFilters()
    filters.tournamentIds = [tourneyId]
    const link = Routes.deckSearch(filters)
    return (
        <SortableTableContainer
            title={`Player Decks`}
            controls={(
                <>
                    {username != null && !isOrganizer && stage === TournamentStage.TOURNAMENT_NOT_STARTED && (
                        <AddTournamentDeckButton eventId={tourneyId} username={username}/>
                    )}
                    <LinkButton href={link} newWindow={true} style={{marginLeft: spacing(2)}}>View Decks</LinkButton>
                </>
            )}
        >
            <SortableTable
                headers={playerDecksTableHeaders()}
                data={decks}
                defaultSort={"username"}
            />
        </SortableTableContainer>
    )
}

const playerDecksTableHeaders = (): SortableTableHeaderInfo<TournamentDeckInfo>[] => {

    return [
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
}
