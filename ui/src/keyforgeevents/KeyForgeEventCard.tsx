import { Box, Card, CardActions, CardContent, CardMedia, Divider, Tooltip, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { TimeUtils } from "../config/TimeUtils"
import { KeyForgeEventDto } from "../generated-src/KeyForgeEventDto"
import { DiscordIcon } from "../generic/icons/DiscordIcon"
import { LinkButton, LinkButtonSafe } from "../mui-restyled/LinkButton"
import { userStore } from "../user/UserStore"
import { AddTournamentToKeyForgeEvent } from "./AddTournamentToKeyForgeEvent"
import { CreateKeyForgeEvent } from "./CreateKeyForgeEvent"
import { DeleteKeyForgeEvent } from "./DeleteKeyForgeEvent"

export const KeyForgeEventCard = observer((props: { event: KeyForgeEventDto }) => {
    const {event} = props
    const {banner, name, description, startDateTime, format, duration, entryFee, discordServer, signupLink, sealed, createdByUsername, tourneyId, id} = event

    const width = 320
    const mediaHeight = 160
    const isOwner = userStore.username === createdByUsername

    return (
        <Card style={{width}}>
            {banner != null && (
                <CardMedia
                    style={{height: mediaHeight}}
                    image={Routes.userContent(banner)}
                    title={"Event banner"}
                />
            )}
            <CardContent style={{maxHeight: 400 + (banner == null ? mediaHeight : 0), overflowY: "auto"}}>
                <Box display={"flex"} justifyContent={"space-between"} mb={1}>
                    <Tooltip title={`Displayed in timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}. UTC time: ${startDateTime}`}>
                        <Typography variant={"subtitle1"} color={"textSecondary"}>{TimeUtils.eventDate(startDateTime)}</Typography>
                    </Tooltip>
                    <Tooltip title={`Displayed in timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}. UTC time: ${startDateTime}`}>
                        <Typography variant={"subtitle1"} color={"textSecondary"}>{TimeUtils.eventTime(startDateTime)}</Typography>
                    </Tooltip>
                </Box>
                <Typography gutterBottom={true} variant={"h5"}>{name}</Typography>
                <Divider/>
                <Box display={"grid"} gridTemplateColumns={"1fr 1fr 1fr"} gridGap={8}>
                    <EventDescriptionLine name={"Variant"} value={format + (sealed ? " SEALED" : "")}/>
                    <EventDescriptionLine name={"Entry Fee"} value={entryFee}/>
                    <EventDescriptionLine name={"Duration"} value={duration}/>
                </Box>
                <Divider/>
                <EventDescriptionLine name={"Description"} value={description}/>
            </CardContent>
            <CardActions>
                {signupLink.length > 0 && (
                    <LinkButtonSafe color={"primary"} href={signupLink}>Sign Up</LinkButtonSafe>
                )}
                {discordServer && (
                    <LinkButtonSafe color={"primary"} href={discordServer}>
                        <DiscordIcon height={24} style={{marginRight: spacing(0.5)}}/>Discord
                    </LinkButtonSafe>
                )}
                {tourneyId != null && (
                    <LinkButton
                        href={Routes.tournamentPage(tourneyId)}
                    >
                        Tournament
                    </LinkButton>
                )}
            </CardActions>
            {isOwner && (
                <Box display={"flex"} flexWrap={"wrap"} p={1} pt={0}>
                    <CreateKeyForgeEvent initialEvent={event}/>
                    <Box pr={1}/>
                    <CreateKeyForgeEvent initialEvent={event} copy={true}/>
                    <Box pr={1}/>
                    <DeleteKeyForgeEvent event={event}/>
                    {tourneyId == null && (
                        <>
                            <Box pr={1}/>
                            <AddTournamentToKeyForgeEvent event={event}/>
                        </>
                    )}
                </Box>
            )}
        </Card>
    )
})

const EventDescriptionLine = (props: { name: string, value?: string, maxHeight?: number, style?: React.CSSProperties }) => {
    const {name, value, maxHeight, style} = props
    if (value == null) {
        return <div/>
    }

    let boxStyle: React.CSSProperties = {}
    if (maxHeight != null) {
        boxStyle = {maxHeight, overflowY: "auto"}
    }

    return (
        <Box my={1} style={{...boxStyle, ...style}}>
            <Typography variant={"body2"} gutterBottom={true} noWrap={true}>
                {name}
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"}>
                {value}
            </Typography>
        </Box>
    )
}
