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
import { uiStore } from "../ui/UiStore"
import { UserLink } from "../user/UserLink"
import { userStore } from "../user/UserStore"
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
        if (message.viewed === null && message.toUsername === userStore.username) {
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
    const fromWidth = 48

    return (
        <Card style={{maxWidth: 800}}>
            <CardContent>
                <Typography variant={"h5"}>{message.subject}</Typography>
                <Box display={"flex"} alignItems={"center"} mb={1} mt={2}>
                    <Box mr={2} width={fromWidth}>
                        <Typography variant={"overline"} color={"textSecondary"}>From</Typography>
                    </Box>
                    <UserLink username={message.fromUsername}/>
                </Box>
                <Box display={"flex"} alignItems={"center"} mb={2}>
                    <Box mr={2} width={fromWidth}>
                        <Typography variant={"overline"} color={"textSecondary"}>To</Typography>
                    </Box>
                    <UserLink username={message.toUsername}/>
                </Box>

                <Box display={"flex"} alignItems={"center"} mt={2}>
                    <Box mr={2} width={fromWidth}>
                        <Typography variant={"overline"} color={"textSecondary"}>
                            Sent
                        </Typography>
                    </Box>
                    <Typography variant={"body2"} color={"textSecondary"}>
                        {TimeUtils.formatLocalUTCToReadableDateTime(message.sent)}
                    </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} mt={1}>
                    <Box mr={2} width={fromWidth}>
                        <Typography variant={"overline"} color={"textSecondary"}>
                            Viewed
                        </Typography>
                    </Box>
                    <Typography variant={"body2"} color={"textSecondary"}>
                        {message.viewed == null ? "Not yet viewed" : TimeUtils.formatLocalUTCToReadableDateTime(message.viewed)}
                    </Typography>
                </Box>

                <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                <Typography variant={"overline"} color={"textSecondary"}>Message</Typography>
                <Typography>{message.message}</Typography>
            </CardContent>

            {actions && (
                <CardActions>
                    {/*<Tooltip title={"Reply"}>*/}
                    {/*    <IconButton>*/}
                    {/*        <Reply/>*/}
                    {/*    </IconButton>*/}
                    {/*</Tooltip>*/}
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

