import { Box, Typography } from "@material-ui/core"
import * as React from "react"
import { useEffect } from "react"
import { TimeUtils } from "../config/TimeUtils"
import { KeyCard } from "../generic/KeyCard"
import { HouseBanner } from "../houses/HouseBanner"
import { Loader } from "../mui-restyled/Loader"
import { UserLink } from "../user/UserLink"
import { userMessageStore } from "./UserMessageStore"

export const MyMessages = () => {

    useEffect(() => {
        userMessageStore.searchMessages()
    }, [])

    if (userMessageStore.searchingMessages) {
        return <Loader/>
    }

    return (
        <Box>
            {!userMessageStore.searchingMessages && userMessageStore.messages.length === 0 && (
                <Typography>You haven't received any messages yet.</Typography>
            )}
            {userMessageStore.messages.map(message => (
                <Box m={2} display={"flex"} flexWrap={"wrap"}>
                    <KeyCard
                        topContents={<Typography variant={"h5"}>{message.subject}</Typography>}
                    >
                        <Typography variant={"overline"}>From</Typography>
                        <UserLink username={message.fromUsername}/>

                        <Typography variant={"body2"}>Sent On: {TimeUtils.parseReadableLocalDateTime(message.sent)}</Typography>
                        <Typography variant={"body2"}>Viewed On: {message.viewed == null ? "Not yet viewed" : TimeUtils.parseReadableLocalDateTime(message.viewed)}</Typography>

                        <Typography variant={"overline"}>Message</Typography>
                        <Typography>{message.message}</Typography>

                        {message.deck != null && (
                            <Box>
                                <Typography variant={"h6"}>{message.deck.name}</Typography>
                                <HouseBanner houses={message.deck.houses}/>
                                <Typography>{message.deck.sas} SAS</Typography>
                            </Box>
                        )}
                    </KeyCard>
                </Box>
            ))}
        </Box>
    )
}
