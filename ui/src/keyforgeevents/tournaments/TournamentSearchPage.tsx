import { Box, Typography } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { TimeUtils } from "../../config/TimeUtils"
import { Utils } from "../../config/Utils"
import { EventTimeRange } from "../../generated-src/EventTimeRange"
import { KeyForgeEventFilters } from "../../generated-src/KeyForgeEventFilters"
import { TournamentSearchResult } from "../../generated-src/TournamentSearchResult"
import { AnnouncementPaper } from "../../generic/AnnouncementPaper"
import { SortableTable, SortableTableContainer, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { SafeKeyButton } from "../../mui-restyled/KeyButton"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { Loader } from "../../mui-restyled/Loader"
import { DiscordButton } from "../../thirdpartysites/discord/DiscordButton"
import { screenStore } from "../../ui/ScreenStore"
import { uiStore } from "../../ui/UiStore"
import { UserLink } from "../../user/UserLink"
import { userStore } from "../../user/UserStore"
import { CreateKeyForgeEvent } from "../CreateKeyForgeEvent"
import { tournamentStore } from "./TournamentStore"


export const TournamentSearchPage = observer(() => {

    const location = useLocation()
    const mineOnly = location.search.includes("mineOnly=true")

    useEffect(() => {
        tournamentSearchStore.performSearch(mineOnly)
        uiStore.setTopbarValues("Tournaments of KeyForge", "Tournaments", "Find a game")
    }, [tournamentSearchStore.search])

    if (tournamentStore.searching) {
        return <Loader/>
    }

    const contents = (
        <>
            <AnnouncementPaper maxWidth={800} style={{marginBottom: spacing(2)}}>
                <Typography variant={"h5"} gutterBottom={true}>
                    Work in Progress!
                </Typography>
                <Typography variant={"body1"} style={{marginBottom: spacing(2)}}>
                    If you intend to create and run a tournament through Decks of KeyForge, please
                    test it out first! You can message me on Discord to get your test tournament deleted after you've verified it works as expected.
                </Typography>
                <DiscordButton/>
            </AnnouncementPaper>
            <TournamentsListView tournaments={tournamentStore.foundTournaments} mineOnly={mineOnly}/>
        </>
    )

    if (screenStore.screenSizeSm()) {
        return (
            <Box m={2} mt={3}>
                {contents}
            </Box>
        )
    }

    return (
        <Box m={4} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            {contents}
        </Box>
    )
})

class TournamentSearchStore {
    @observable
    search: KeyForgeEventFilters = {
        timeRange: EventTimeRange.NEXT_MONTH,
        promoted: false,
        formats: [],
        withTournaments: true,
        mineOnly: false,
    }

    performSearch = async (mineOnly: boolean) => {
        this.search.mineOnly = mineOnly
        await tournamentStore.searchTournaments(this.search)
    }

    sealedValue = () => {
        if (this.search.sealed === true) {
            return "sealed"
        } else if (this.search.sealed === false) {
            return "archon"
        }
        return ""
    }

    constructor() {
        makeObservable(this)
    }
}

const tournamentSearchStore = new TournamentSearchStore()

const TournamentsListView = observer((props: { tournaments: TournamentSearchResult[], mineOnly: boolean }) => {

    const {tournaments, mineOnly} = props
    return (
        <SortableTableContainer
            title={"Tournaments"}
            controls={(
                <Box display={"flex"} alignItems={"center"}>
                    {userStore.loggedIn() && (
                        <LinkButton href={mineOnly ? Routes.tournaments : Routes.myTournaments} style={{marginRight: spacing(2)}}>
                            {mineOnly ? "All" : "My"} Tournaments
                        </LinkButton>
                    )}
                    <CreateKeyForgeEvent tournament={true}/>
                </Box>
            )}
        >
            <SortableTable
                headers={tournamentsTableHeaders(userStore.isAdmin)}
                data={tournaments}
                defaultSort={"Start Date"}
                defaultSortFunction={tourney => tourney.event.startDateTime}
            />
        </SortableTableContainer>
    )
})

const tournamentsTableHeaders = (isAdmin: boolean): SortableTableHeaderInfo<TournamentSearchResult>[] => {

    const headers: SortableTableHeaderInfo<TournamentSearchResult>[] = [
        {
            property: "name",
            transform: tournament => (
                <KeyLink to={Routes.tournamentPage(tournament.id)} newWindow={true}>
                    {tournament.name}
                </KeyLink>
            )
        },
        {
            title: "Start Date",
            transform: tournament => TimeUtils.tournamentDate(tournament.event.startDateTime),
            sortFunction: tournament => tournament.event.startDateTime
        },
        {
            title: "Format",
            transform: tournament => Utils.enumNameToReadable(tournament.event.format),
            sortFunction: tournament => tournament.event.format
        },
        {property: "stage", transform: tournament => Utils.enumNameToReadable(tournament.stage)},
        {property: "private", title: "Registration", transform: tournament => tournament.private ? "Private" : "Public"},
        {property: "participants"},
        {
            property: "organizerUsernames",
            title: "Organizers",
            sortable: false,
            transform: tournament => (
                <>
                    {tournament.organizerUsernames.map((username, idx) =>
                        <UserLink key={username} username={username}
                                  style={{marginRight: idx !== (tournament.organizerUsernames.length - 1) ? spacing(2) : undefined}}/>
                    )}
                </>
            )
        },
        {
            transform: tournament => (
                <Box display={"flex"}>
                    <LinkButton href={Routes.tournamentPage(tournament.id)} newWindow={true}>Tournament</LinkButton>
                    <LinkButton href={Routes.tournamentDecksSearch(tournament.id)} newWindow={true} style={{marginLeft: spacing(2)}}>Decks</LinkButton>
                    {isAdmin && <DeleteTournament tournament={tournament}/>}
                </Box>
            )
        }
    ]

    return headers
}

const DeleteTournament = (props: { tournament: TournamentSearchResult }) => {
    const {tournament} = props
    return (
        <SafeKeyButton
            title={`Delete ${tournament.name}?`}
            description={"Delete this tournament?"}
            warning={"This will also delete the event."}
            onConfirm={() => tournamentStore.deleteTournament(tournament.id)}
            style={{marginLeft: spacing(2)}}
            confirmPassword={true}
        >
            Delete
        </SafeKeyButton>
    )
}
