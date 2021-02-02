import { Box, Paper } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { EventTimeRange } from "../generated-src/EventTimeRange"
import { Loader } from "../mui-restyled/Loader"
import { KeyForgeEventCalendar } from "./KeyForgeEventCalendar"
import { keyForgeEventStore } from "./KeyForgeEventStore"

export const PromotedKeyForgeEvents = observer(() => {

    useEffect(() => {
        keyForgeEventStore.searchEvents({
            timeRange: EventTimeRange.NEXT_TWO_MONTHS,
            promoted: true,
            formats: []
        })
    }, [])

    if (keyForgeEventStore.searchingEvents) {
        return <Loader/>
    }

    return (
        <Paper>
            <Box p={2}>
                <KeyForgeEventCalendar events={keyForgeEventStore.foundEvents}/>
            </Box>
        </Paper>
    )
})