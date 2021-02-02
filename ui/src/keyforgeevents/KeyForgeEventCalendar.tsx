import { Box, Typography } from "@material-ui/core"
import React from "react"
import { themeStore } from "../config/MuiConfig"
import { TimeUtils } from "../config/TimeUtils"
import { KeyForgeEventDto } from "../generated-src/KeyForgeEventDto"
import { KeyForgeEventCard } from "./KeyForgeEventCard"

export const KeyForgeEventCalendar = (props: { events: KeyForgeEventDto[] }) => {
    const {events} = props

    if (events.length === 0) {
        return <Typography>No events found.</Typography>
    }

    const eventsByWeek: EventsInAWeek[] = []
    let currentWeekStart: string | undefined = undefined

    events.forEach(event => {
        const thisEventWeekStart = TimeUtils.weekDescriptionForEvent(TimeUtils.eventDateTime(event.startDateTime))
        if (thisEventWeekStart !== currentWeekStart) {
            currentWeekStart = thisEventWeekStart
            eventsByWeek.push({
                weekName: currentWeekStart,
                events: []
            })
        }
        eventsByWeek[eventsByWeek.length - 1].events.push(event)
    })

    return (
        <Box>
            {eventsByWeek.map((eventsForWeek, idx) => (
                <KeyForgeEventsWeek week={eventsForWeek.weekName} events={eventsForWeek.events} idx={idx} key={eventsForWeek.weekName}/>
            ))}
        </Box>
    )
}

export const KeyForgeEventsWeek = (props: { week: string, events: KeyForgeEventDto[], idx: number }) => {
    const {week, events, idx} = props

    return (
        <Box mt={idx === 0 ? 0 : 4}>
            <Typography variant={"h6"}>{week}</Typography>
            <Box
                display={"flex"}
                flexWrap={"wrap"}
                mt={2}
                pt={2}
                px={2}
                style={{backgroundColor: themeStore.calendarBackground, borderRadius: 4}}
            >
                {events.map(event => {
                    return (
                        <Box key={event.id} mr={2} mb={2}>
                            <KeyForgeEventCard event={event}/>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

interface EventsInAWeek {
    weekName: string
    events: KeyForgeEventDto[]
}
