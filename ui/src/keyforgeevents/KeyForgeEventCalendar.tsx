import { Box, Grid, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { TimeUtils } from "../config/TimeUtils"
import { KeyForgeEventDto } from "../generated-src/KeyForgeEventDto"
import { screenStore } from "../ui/ScreenStore"
import { KeyForgeEventCard } from "./KeyForgeEventCard"

export const KeyForgeEventCalendar = (props: { events: KeyForgeEventDto[] }) => {
    const {events} = props

    if (events.length === 0) {
        return <Typography>No events found.</Typography>
    }

    const eventsByWeek: EventsInAWeek[] = []
    let currentWeekStart: string | undefined = undefined

    events.forEach(event => {
        const eventStartDateTime = TimeUtils.eventDateTime(event.startDateTime)
        const thisEventWeekStart = TimeUtils.weekDescriptionForEvent(eventStartDateTime)

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
            {eventsByWeek.map((eventsForWeek) => (
                <KeyForgeEventsWeek week={eventsForWeek.weekName} events={eventsForWeek.events} key={eventsForWeek.weekName}/>
            ))}
        </Box>
    )
}

export const KeyForgeEventsWeek = observer((props: { week: string, events: KeyForgeEventDto[] }) => {
    const {week, events} = props

    const contents = (
        <Grid container={true} spacing={2}>
            {events.map(event => {
                return (
                    <Grid item={true} key={event.id}>
                        <KeyForgeEventCard event={event}/>
                    </Grid>
                )
            })}
        </Grid>
    )

    if (screenStore.screenSizeXs()) {
        return (
            <Box my={2}>
                <Typography gutterBottom={true} variant={"h6"}>{week}</Typography>
                {contents}
            </Box>
        )
    }

    return (
        <Box
            display={"flex"}
            flexWrap={"wrap"}
            mt={2}
            p={2}
            style={{backgroundColor: themeStore.calendarBackground, borderRadius: 4}}
        >
            <Typography variant={"h6"} style={{marginBottom: spacing(2)}}>{week}</Typography>
            {contents}
        </Box>
    )
})

interface EventsInAWeek {
    weekName: string
    events: KeyForgeEventDto[]
}
