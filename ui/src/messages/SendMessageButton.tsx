import { Button, Dialog, Link } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { HelperText } from "../generic/CustomTypographies"
import { KeyButton } from "../mui-restyled/KeyButton"
import { messageStore } from "../ui/MessageStore"
import { userMessageStore } from "./UserMessageStore"


export const SendMessageButton = observer((props: {
    toUsername: string,
    deckId?: number,
    deckName?: string,
    replyToId?: number,
    color?: "primary" | undefined,
    variant?: "outlined" | undefined,
    style?: React.CSSProperties,
}) => {

    const {toUsername, deckId, deckName, replyToId, color, variant, style} = props

    const [store] = useState(new SendMessageStore(toUsername, deckId, deckName, replyToId))

    return (
        <>
            <Button style={style} onClick={() => store.open = true} color={color} variant={variant}>
                Send Message
            </Button>
            <Dialog
                open={store.open}
                onClose={store.handleClose}
            >
                <DialogTitle>
                    Send a message to {toUsername}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        variant={"outlined"}
                        label={"Subject"}
                        value={store.subject}
                        onChange={(event) => store.subject = event.target.value}
                        fullWidth={true}
                        helperText={store.subjectValid() ? undefined : `Please include a subject of 400 characters or fewer.`}
                    />
                    <TextField
                        variant={"outlined"}
                        label={"Message"}
                        value={store.message}
                        onChange={(event) => store.message = event.target.value}
                        multiline={true}
                        rows={5}
                        fullWidth={true}
                        helperText={store.messageValid() ? undefined : `Please include a message of 4000 characters or fewer.`}
                        error={!store.messageValid()}
                        style={{marginTop: spacing(2)}}
                    />
                    <HelperText style={{marginTop: spacing(2)}}>
                        This message will be sent through DoK, and the recipient will be able to view it here. Please
                        check <Link href={Routes.messages}>your messages</Link> for a response.
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
                        color={"primary"}
                        onClick={store.sendMessage}
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
        if (this.subject.trim().length < 3) {
            messageStore.setErrorMessage("Please include a subject.")
            return
        }
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