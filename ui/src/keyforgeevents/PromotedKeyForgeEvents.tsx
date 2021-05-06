import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { EventTimeRange } from "../generated-src/EventTimeRange"
import { Loader } from "../mui-restyled/Loader"
import { KeyForgeEventCalendar } from "./KeyForgeEventCalendar"
import { keyForgeEventStore } from "./KeyForgeEventStore"

export const PromotedKeyForgeEvents = observer(() => {

    useEffect(() => {
        keyForgeEventStore.searchEvents({
            timeRange: EventTimeRange.NEXT_MONTH,
            promoted: true,
            formats: [],
            mineOnly: false,
        })
    }, [])

    if (keyForgeEventStore.searchingEvents) {
        return <Loader/>
    }

    return (
        <KeyForgeEventCalendar events={keyForgeEventStore.foundEvents}/>
    )
})
