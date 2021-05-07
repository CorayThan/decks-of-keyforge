import { Box, Card, CardActions, CardContent, Divider, IconButton, Tooltip, Typography } from "@material-ui/core"
import { Archive, Unarchive } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { spacing } from "../config/MuiConfig"
import { TimeUtils } from "../config/TimeUtils"
import { deckStore } from "../decks/DeckStore"
import { DeckViewSmall } from "../decks/DeckViewSmall"
import { PrivateMessageDto } from "../generated-src/PrivateMessageDto"
import { Loader } from "../mui-restyled/Loader"
import { WhiteSpaceTypography } from "../mui-restyled/WhiteSpaceTypography"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { UserLink } from "../user/UserLink"
import { userStore } from "../user/UserStore"
import { SendMessageButton } from "./SendMessageButton"
import { userMessageStore } from "./UserMessageStore"

export const ViewMessagePage = observer(() => {

    const {id} = useParams<{ id: string }>()

    useEffect(() => {
        uiStore.displayBack = true
        userMessageStore.findMessage(Number(id))
        return () => {
            uiStore.displayBack = true
            userMessageStore.message = undefined
        }
    }, [id])

    if (userMessageStore.message == null) {
        return <Loader/>
    }

    return <ViewMessage message={userMessageStore.message}/>
})

const ViewMessage = observer((props: { message: PrivateMessageDto }) => {

    const {message} = props

    useEffect(() => {
        if (message.deck?.keyforgeId != null) {
            deckStore.findDeck(message.deck.keyforgeId)
        }
    }, [message.deck?.keyforgeId])

    useEffect(() => {
        if (message.viewed === null && message.toUsername === userStore.username ||
            (message.replies.find(reply => reply.viewed === null && reply.toUsername === userStore.username))
        ) {
            userMessageStore.markRead(message.id)
        }

        let title
        if (message.toUsername === userStore.username) {
            title = `Message from ${message.fromUsername}`
        } else {
            title = `Message to ${message.toUsername}`
        }

        uiStore.setTopbarValues(title, "Message", "")
    }, [message.id])

    return (
        <Box m={2} mt={4} display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
            <Box mr={2}>
                <IndividualMessage message={message} actions={true}/>
                {message.replies.map(reply => (
                    <IndividualMessage message={reply}/>
                ))}
            </Box>
            {deckStore.deck != null && (
                <DeckViewSmall deck={deckStore.deck.deck} margin={0}/>
            )}
        </Box>
    )
})

const IndividualMessage = observer((props: { message: PrivateMessageDto, actions?: boolean }) => {
    const {message, actions} = props

    const recipientUsername = message.toUsername === userStore.username ? message.fromUsername : message.toUsername

    let viewedTime = message.viewed
    if (viewedTime == null) {
        viewedTime = userMessageStore.readTimes.get(message.id)
    }

    return (
        <Card style={{maxWidth: 800, marginBottom: spacing(2)}}>
            <CardContent>
                {message.subject.length > 0 && (
                    <Typography variant={"h5"} style={{marginBottom: spacing(2)}}>{message.subject}</Typography>
                )}

                <Box
                    display={"grid"}
                    gridTemplateColumns={screenStore.screenSizeXs() ? "1fr 3fr" : "1fr 3fr 1fr 4fr"}
                    gridGap={spacing(1)}
                    alignItems={"center"}
                >
                    <Typography variant={"overline"} color={"textSecondary"}>From</Typography>
                    <Box>
                        <UserLink username={message.fromUsername}/>
                    </Box>
                    <Typography variant={"overline"} color={"textSecondary"}>
                        Sent
                    </Typography>
                    <Typography variant={"body2"} color={"textSecondary"}>
                        {TimeUtils.formatLocalUTCToReadableDateTime(message.sent)}
                    </Typography>
                    <Typography variant={"overline"} color={"textSecondary"}>To</Typography>
                    <Box>
                        <UserLink username={message.toUsername}/>
                    </Box>
                    <Typography variant={"overline"} color={"textSecondary"}>
                        Viewed
                    </Typography>
                    <Typography variant={"body2"} color={"textSecondary"}>
                        {viewedTime == null ? "Not viewed" : TimeUtils.formatLocalUTCToReadableDateTime(viewedTime)}
                    </Typography>
                </Box>
                <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                <Typography variant={"overline"} color={"textSecondary"}>Message</Typography>
                <WhiteSpaceTypography>{message.message}</WhiteSpaceTypography>
            </CardContent>

            {actions && (
                <CardActions>
                    <SendMessageButton toUsername={recipientUsername} replyToId={message.id} onSent={() => userMessageStore.findMessage(message.id)}/>
                    {message.hidden ? (
                        <Tooltip title={"Unarchive message"}>
                            <IconButton
                                onClick={async () => {
                                    message.hidden = !message.hidden
                                    await userMessageStore.archiveMessage(message.id, false)
                                }}
                            >
                                <Unarchive/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title={"Archive message"}>
                            <IconButton
                                onClick={async () => {
                                    message.hidden = !message.hidden
                                    await userMessageStore.archiveMessage(message.id, true)
                                }}
                            >
                                <Archive/>
                            </IconButton>
                        </Tooltip>
                    )}
                </CardActions>
            )}
        </Card>
    )
})

