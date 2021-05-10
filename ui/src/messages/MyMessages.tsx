import { Box, ButtonBase, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@material-ui/core"
import { Archive, Delete, Inbox, Mail, MarkunreadMailbox, Send, Unarchive } from "@material-ui/icons"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { TimeUtils } from "../config/TimeUtils"
import { MailCategory } from "../generated-src/MailCategory"
import { MessagesSearchFilters } from "../generated-src/MessagesSearchFilters"
import { MarkEmailReadIcon } from "../generic/icons/MarkEmailReadIcon"
import { Loader } from "../mui-restyled/Loader"
import { screenStore } from "../ui/ScreenStore"
import { UserLink } from "../user/UserLink"
import { userStore } from "../user/UserStore"
import { SendMessageButton } from "./SendMessageButton"
import { userMessageStore } from "./UserMessageStore"

export const MyMessages = observer(() => {

    useEffect(() => {
        userMessageStore.searchMessages(store.filters)
    }, [])

    if (userMessageStore.messages == null) {
        return <Loader/>
    }

    const {category} = store.filters

    const buttonWidth = undefined

    return (
        <TableContainer component={Paper}>
            <Box>
                <ToggleButtonGroup
                    value={category}
                    exclusive={true}
                    onChange={(event, category: MailCategory) => {
                        store.changeCategory(category)
                    }}
                    aria-label="category"
                >
                    <ToggleButton value={MailCategory.INBOX} aria-label="inbox">
                        <Box display={"flex"} width={buttonWidth}>
                            <Inbox style={{marginRight: spacing(1)}}/> Inbox
                        </Box>
                    </ToggleButton>
                    <ToggleButton value={MailCategory.SENT} aria-label="sent">
                        <Box display={"flex"} width={buttonWidth}>
                            <Send style={{marginRight: spacing(1)}}/> Sent
                        </Box>
                    </ToggleButton>
                    <ToggleButton value={MailCategory.UNREAD} aria-label="unread">
                        <Box display={"flex"} width={buttonWidth}>
                            <MarkunreadMailbox style={{marginRight: spacing(1)}}/> Unread
                        </Box>
                    </ToggleButton>
                    {!screenStore.screenSizeXs() && (
                        <ToggleButton value={MailCategory.ALL_MAIL} aria-label="all mail">
                            <Box display={"flex"} width={buttonWidth}>
                                <Mail style={{marginRight: spacing(1)}}/> All Mail
                            </Box>
                        </ToggleButton>
                    )}
                    <ToggleButton value={MailCategory.ARCHIVED} aria-label="archived">
                        <Box display={"flex"} width={buttonWidth}>
                            <Delete style={{marginRight: spacing(1)}}/> Archived
                        </Box>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box>
                {!userMessageStore.searchingMessages && userMessageStore.messages.length === 0 ? (
                    <Box m={2}>
                        <Typography>No messages</Typography>
                    </Box>
                ) : (
                    <Table size={"small"} padding={screenStore.screenSizeXs() ? "checkbox" : undefined}>
                        <TableBody>
                            {userMessageStore.messages.map(message => {
                                const toMe = message.toUsername === userStore.username
                                const replyToUsername = toMe ? message.fromUsername : message.toUsername
                                return (
                                    <TableRow key={message.id} style={{backgroundColor: message.fullyViewed ? themeStore.lightBackgroundColor : undefined}}>
                                        <TableCell>
                                            <Box display={"flex"} alignItems={"center"}>
                                                {toMe ? <UserLink username={message.fromUsername}/> : (
                                                    <Box display={"flex"} alignItems={"center"}>
                                                        <Typography variant={"body2"}>
                                                            To:
                                                        </Typography>
                                                        <UserLink username={message.toUsername} style={{marginLeft: spacing(1)}}/>
                                                    </Box>
                                                )}
                                                {message.replies.length > 0 && (
                                                    <Tooltip title={"Reply count"}>
                                                        <Typography variant={"body1"} color={"textSecondary"} style={{marginLeft: spacing(1)}}>
                                                            {message.replies.length}
                                                        </Typography>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <ButtonBase href={Routes.messagePage(message.id)} disableRipple={true} disableTouchRipple={true}>
                                                <Box display={"flex"}>
                                                    <Box fontWeight={500} width={screenStore.screenSizeXs() ? 120 : 240}>
                                                        <Typography>
                                                            {message.subject}
                                                        </Typography>
                                                    </Box>
                                                    {!screenStore.screenSizeMd() && (
                                                        <Box ml={2} maxWidth={screenStore.screenWidth - 1000}>
                                                            <Typography noWrap={true} color={"textSecondary"}>
                                                                {message.replies.length > 0 ? message.replies[message.replies.length - 1].message : message.message}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </ButtonBase>
                                        </TableCell>
                                        {!screenStore.screenSizeSm() && (
                                            <TableCell align={"right"}>
                                                {!toMe && (
                                                    <>
                                                        {message.viewed ? `Viewed: ${TimeUtils.formatLocalUTCToShortDate(message.viewed)}` : "Not Viewed"}
                                                    </>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell align={"right"}>
                                            {screenStore.screenSizeSm() ? TimeUtils.formatLocalUTCToShortDate(message.sent) : TimeUtils.formatLocalUTCToReadableDateTime(message.sent)}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            <Box display={"flex"} justifyContent={"flex-end"}>
                                                <SendMessageButton
                                                    toUsername={replyToUsername}
                                                    replyToId={message.id}
                                                    onSent={store.search}
                                                />
                                                {!screenStore.screenSizeXs() && (
                                                    <>
                                                        {message.hidden ? (
                                                            <Tooltip title={"Unarchive message"}>
                                                                <IconButton
                                                                    onClick={async () => {
                                                                        await userMessageStore.archiveMessage(message.id, false)
                                                                        store.search()
                                                                    }}
                                                                >
                                                                    <Unarchive/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title={"Archive message"}>
                                                                <IconButton
                                                                    onClick={async () => {
                                                                        await userMessageStore.archiveMessage(message.id, true)
                                                                        store.search()
                                                                    }}
                                                                >
                                                                    <Archive/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {!message.fullyViewed && (
                                                            <Tooltip title={"Mark as read"}>
                                                                <IconButton
                                                                    onClick={async () => {
                                                                        await userMessageStore.markRead(message.id)
                                                                        store.search()
                                                                    }}
                                                                >
                                                                    <MarkEmailReadIcon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </TableContainer>
    )
})

class MyMessagesStore {

    @observable
    filters: MessagesSearchFilters = {
        category: MailCategory.INBOX,
        page: 0,
        pageSize: 10000
    }

    changeCategory = (category: MailCategory) => {
        this.filters.category = category
        this.search()
    }

    search = () => {
        userMessageStore.searchMessages(this.filters)
    }

    constructor() {
        makeObservable(this)
    }
}

const store = new MyMessagesStore()
