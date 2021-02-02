import { Box, Button, Divider, FormControl, Input, InputLabel, MenuItem, Paper, Select, Typography } from "@material-ui/core"
import { startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { spacing } from "../config/MuiConfig"
import { Utils } from "../config/Utils"
import { EventTimeRange } from "../generated-src/EventTimeRange"
import { KeyForgeEventFilters } from "../generated-src/KeyForgeEventFilters"
import { KeyForgeFormat } from "../generated-src/KeyForgeFormat"
import { Loader } from "../mui-restyled/Loader"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { CreateKeyForgeEvent } from "./CreateKeyForgeEvent"
import { KeyForgeEventCalendar } from "./KeyForgeEventCalendar"
import { keyForgeEventStore } from "./KeyForgeEventStore"

export const KeyForgeEventsPage = observer(() => {

    useEffect(() => {
        keyForgeEventsSearchStore.performSearch()
        uiStore.setTopbarValues("Events of KeyForge", "Events", "Find a game")
    }, [keyForgeEventsSearchStore.search])

    if (keyForgeEventStore.searchingEvents) {
        return <Loader/>
    }

    const narrow = screenStore.screenSizeMd()

    return (
        <Box m={4}>
            <Paper>
                <Box p={2}>
                    <Box display={"flex"} mb={2}>
                        <Typography variant={"h4"} color={"primary"}>Calendar of Events</Typography>
                        <Box flexGrow={1} ml={2}/>
                        {!narrow && <KeyForgeEventsSearchOptions/>}
                        <CreateKeyForgeEvent/>
                    </Box>
                    {narrow && (
                        <Box mb={2}>
                            <KeyForgeEventsSearchOptions/>
                        </Box>
                    )}
                    <Divider/>
                    <Box mt={2}>
                        <KeyForgeEventCalendar events={keyForgeEventStore.foundEvents}/>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
})

const KeyForgeEventsSearchOptions = observer(() => {
    return (
        <>
            <FormControl style={{marginRight: spacing(2)}}>
                <InputLabel>Date Range</InputLabel>
                <Select
                    value={keyForgeEventsSearchStore.search.timeRange}
                    onChange={(event) => {
                        keyForgeEventsSearchStore.search.timeRange = event.target.value as EventTimeRange
                    }}
                >
                    <MenuItem value={EventTimeRange.NEXT_TWO_MONTHS}>Next Two Months</MenuItem>
                    <MenuItem value={EventTimeRange.FUTURE}>All Future Events</MenuItem>
                    <MenuItem value={EventTimeRange.PAST}>Past Events</MenuItem>
                </Select>
            </FormControl>
            <FormControl style={{marginRight: spacing(2), minWidth: 80}}>
                <InputLabel>Format</InputLabel>
                <Select
                    value={keyForgeEventsSearchStore.sealedValue()}
                    onChange={(event) => {
                        const value = event.target.value
                        if (value == "") {
                            keyForgeEventsSearchStore.search.sealed = undefined
                        } else {
                            keyForgeEventsSearchStore.search.sealed = value !== "archon"
                        }
                    }}
                >
                    <MenuItem value={""}>Any</MenuItem>
                    <MenuItem value={"archon"}>Archon</MenuItem>
                    <MenuItem value={"sealed"}>Sealed</MenuItem>
                </Select>
            </FormControl>
            <FormControl style={{marginRight: spacing(2), minWidth: 80}}>
                <InputLabel>Variants</InputLabel>
                <Select
                    input={<Input/>}
                    multiple={true}
                    value={keyForgeEventsSearchStore.search.formats}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        keyForgeEventsSearchStore.search.formats = event.target.value as KeyForgeFormat[]
                    }}
                >
                    {Utils.enumValues(KeyForgeFormat).map(format => (
                        <MenuItem key={format} value={format}>{startCase((format as string).toLowerCase())}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button style={{marginRight: spacing(2)}} onClick={keyForgeEventsSearchStore.performSearch}>Search Events</Button>
        </>
    )
})

class KeyForgeEventsSearchStore {
    @observable
    search: KeyForgeEventFilters = {
        timeRange: EventTimeRange.NEXT_TWO_MONTHS,
        promoted: false,
        formats: []
    }

    performSearch = async () => {
        await keyForgeEventStore.searchEvents(this.search)
    }

    sealedValue = () => {
        if (this.search.sealed === true) {
            return "sealed"
        } else if (this.search.sealed === false) {
            return "archon"
        }
        return ""
    }
}


const keyForgeEventsSearchStore = new KeyForgeEventsSearchStore()
