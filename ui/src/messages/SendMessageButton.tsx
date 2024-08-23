import { Button, Dialog, IconButton, Tooltip } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { Reply } from "@material-ui/icons"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { HelperText } from "../generic/CustomTypographies"
import { KeyButton } from "../mui-restyled/KeyButton"
import { userMessageStore } from "./UserMessageStore"
import { DokLink } from "../generic/DokLink"


export const SendMessageButton = observer((props: {
    toUsername: string,
    deckId?: number,
    deckName?: string,
    replyToId?: number,
    color?: "primary" | "secondary" | undefined,
    variant?: "outlined" | undefined,
    onSent?: () => void,
    style?: React.CSSProperties,
}) => {

    const {toUsername, deckId, deckName, replyToId, color, variant, onSent, style} = props

    const [store] = useState(new SendMessageStore(toUsername, deckId, deckName, replyToId))

    return (
        <>
            {replyToId == null ? (
                <Button style={style} onClick={() => store.open = true} color={color} variant={variant}>
                    Send Message
                </Button>
            ) : (
                <Tooltip title={"Reply"}>
                    <IconButton onClick={() => store.open = true} style={style}>
                        <Reply/>
                    </IconButton>
                </Tooltip>
            )}
            <Dialog
                open={store.open}
                onClose={store.handleClose}
            >
                <DialogTitle>
                    {replyToId == null ? `Send a message to ${toUsername}` : `Replying to ${toUsername}`}
                </DialogTitle>
                <DialogContent>
                    {replyToId == null && (
                        <TextField
                            variant={"outlined"}
                            label={"Subject"}
                            value={store.subject}
                            onChange={(event) => store.subject = event.target.value}
                            fullWidth={true}
                            helperText={store.subjectValid() ? undefined : `Please include a subject of 400 characters or fewer.`}
                            style={{marginBottom: spacing(2)}}
                        />
                    )}
                    <TextField
                        variant={"outlined"}
                        label={replyToId == null ? "Message" : "Reply"}
                        value={store.message}
                        onChange={(event) => store.message = event.target.value}
                        multiline={true}
                        rows={5}
                        fullWidth={true}
                        helperText={store.messageValid() ? undefined : `Please include a message of 4000 characters or fewer.`}
                        error={!store.messageValid()}
                    />
                    <HelperText style={{marginTop: spacing(2)}}>
                        This message will be sent through DoK, and the recipient will be able to view it here. Please
                        check <DokLink href={Routes.messages}>your messages</DokLink> for a response.
                    </HelperText>
                    {deckName != null && (
                        <HelperText style={{marginTop: spacing(1)}}>
                            It will include a link to {deckName}, the deck you are messaging about.
                        </HelperText>
                    )}
                </DialogContent>
                <DialogActions>
                    <KeyButton onClick={store.handleClose}>Cancel</KeyButton>
                    <KeyButton
                        color={themeStore.darkMode ? "secondary" : "primary"}
                        onClick={async () => {
                            await store.sendMessage()
                            if (onSent != null) {
                                onSent()
                            }
                        }}
                        disabled={!store.valid() || userMessageStore.sendingSellerMessage}
                        loading={userMessageStore.sendingSellerMessage}
                    >
                        Send Message
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </>
    )
})

class SendMessageStore {

    subjectMaxLength = 400
    messageMaxLength = 4000

    @observable
    open = false

    @observable
    subject = ""

    @observable
    message = ""

    handleClose = () => {
        this.open = false
        this.subject = ""
        this.message = ""
    }

    subjectValid = () => {
        return this.subject.trim.length <= this.subjectMaxLength
    }
    messageValid = () => {
        return this.message.trim.length <= this.messageMaxLength
    }

    valid = () => this.subjectValid() && this.messageValid()

    sendMessage = async () => {
        await userMessageStore.sendMessage({
            toUsername: this.toUsername,
            subject: this.subject.trim(),
            message: this.message.trim(),
            deckId: this.deckId,
            replyToId: this.replyToId,
        }, this.deckName)
        this.handleClose()
    }

    constructor(private toUsername: string, private deckId?: number, private deckName?: string, private replyToId?: number) {
        makeObservable(this)
    }
}