import { Box } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { EventTimeRange } from "../../generated-src/EventTimeRange"
import { KeyForgeEventFilters } from "../../generated-src/KeyForgeEventFilters"
import { TournamentSearchResult } from "../../generated-src/TournamentSearchResult"
import { SortableTable, SortableTableContainer, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { Loader } from "../../mui-restyled/Loader"
import { uiStore } from "../../ui/UiStore"
import { CreateKeyForgeEvent } from "../CreateKeyForgeEvent"
import { tournamentStore } from "./TournamentStore"


export const TournamentSearchPage = observer(() => {

    useEffect(() => {
        tournamentSearchStore.performSearch()
        uiStore.setTopbarValues("Tournaments of KeyForge", "Tournaments", "Find a game")
    }, [tournamentSearchStore.search])

    if (tournamentStore.searching) {
        return <Loader/>
    }

    return (
        <Box m={4}>
            <TournamentsListView tournaments={tournamentStore.foundTournaments}/>
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
    }

    performSearch = async () => {
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

const TournamentsListView = observer((props: { tournaments: TournamentSearchResult[] }) => {
    const {tournaments} = props
    return (
        <SortableTableContainer
            title={"Tournaments"}
            controls={(
                <Box display={"flex"} alignItems={"center"}>
                    {/*<FormControl style={{marginRight: spacing(2)}}>*/}
                    {/*    <InputLabel>Date Range</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        value={tournamentSearchStore.search.timeRange}*/}
                    {/*        onChange={(event) => {*/}
                    {/*            tournamentSearchStore.search.timeRange = event.target.value as EventTimeRange*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <MenuItem value={EventTimeRange.NEXT_MONTH}>Next Month</MenuItem>*/}
                    {/*        <MenuItem value={EventTimeRange.NEXT_THREE_MONTHS}>Next Three Months</MenuItem>*/}
                    {/*        <MenuItem value={EventTimeRange.FUTURE}>All Future Events</MenuItem>*/}
                    {/*        <MenuItem value={EventTimeRange.PAST}>Past Events</MenuItem>*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                    {/*<FormControl style={{marginRight: spacing(2), minWidth: 80}}>*/}
                    {/*    <InputLabel>Format</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        value={tournamentSearchStore.sealedValue()}*/}
                    {/*        onChange={(event) => {*/}
                    {/*            const value = event.target.value*/}
                    {/*            if (value == "") {*/}
                    {/*                tournamentSearchStore.search.sealed = undefined*/}
                    {/*            } else {*/}
                    {/*                tournamentSearchStore.search.sealed = value !== "archon"*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <MenuItem value={""}>Any</MenuItem>*/}
                    {/*        <MenuItem value={"archon"}>Archon</MenuItem>*/}
                    {/*        <MenuItem value={"sealed"}>Sealed</MenuItem>*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                    {/*<FormControl style={{marginRight: spacing(2), minWidth: 80}}>*/}
                    {/*    <InputLabel>Variants</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        input={<Input/>}*/}
                    {/*        multiple={true}*/}
                    {/*        value={tournamentSearchStore.search.formats}*/}
                    {/*        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {*/}
                    {/*            tournamentSearchStore.search.formats = event.target.value as KeyForgeFormat[]*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        {Utils.enumValues(KeyForgeFormat).map(format => (*/}
                    {/*            <MenuItem key={format} value={format}>{startCase((format as string).toLowerCase())}</MenuItem>*/}
                    {/*        ))}*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                    {/*<Button style={{marginRight: spacing(2)}} onClick={tournamentSearchStore.performSearch}>Search Tournaments</Button>*/}
                    <CreateKeyForgeEvent tournament={true}/>
                </Box>
            )}
        >
            <SortableTable
                headers={tournamentsTableHeaders()}
                data={tournaments}
                defaultSort={"name"}
            />
        </SortableTableContainer>
    )
})

const tournamentsTableHeaders = (): SortableTableHeaderInfo<TournamentSearchResult>[] => {

    return [
        {
            property: "name",
            transform: tournament => (
                <KeyLink style={{color: themeStore.defaultTextColor}} noStyle={true} to={Routes.tournamentPage(tournament.id)} newWindow={true}>
                    {tournament.name}
                </KeyLink>
            )
        },
        {title: "Start Date", transform: tournament => tournament.event?.startDateTime}
    ]
}
