import { Button, Dialog, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { emailStore } from "./EmailStore"

interface SendSellerEmailDialogProps {
    recipientUsername?: string
    deckName?: string
    keyforgeId?: string
    offerId?: string
    buttonText?: string
    /**
     * If you include this the button will be hidden
     */
    store?: SendEmailDialogStore
}

export class SendEmailDialogStore {
    @observable
    open = false

    @observable
    message = ""

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
        this.message = ""
    }

    sendMessage = async (props: SendSellerEmailDialogProps) => {
        const {message} = this
        const {recipientUsername, deckName, keyforgeId, offerId} = props
        if (message.trim().length === 0) {
            messageStore.setWarningMessage("Please include a message.")
            return
        }

        if (offerId == null) {
            await emailStore.sendSellerMessage({
                username: recipientUsername!,
                deckName: deckName!,
                deckKeyforgeId: keyforgeId!,
                message,
                senderUsername: userStore.username!
            })
        } else {
            await emailStore.sendOfferMessage(offerId, message.trim())
        }
        this.handleClose()
    }

    constructor() {
        makeObservable(this)
    }
}

@observer
export class SendEmailDialog extends React.Component<SendSellerEmailDialogProps> {

    store: SendEmailDialogStore

    constructor(props: SendSellerEmailDialogProps) {
        super(props)
        if (props.store) {
            this.store = props.store
        } else {
            this.store = new SendEmailDialogStore()
        }
    }

    render() {
        const {recipientUsername, deckName, offerId, buttonText} = this.props

        return (
            <>
                {this.props.store == null && (
                    <Button
                        onClick={() => {
                            this.store.handleOpen()
                        }}
                    >
                        {buttonText == null ? "Send Email" : buttonText}
                    </Button>
                )}
                <Dialog
                    open={this.store.open}
                    onClose={this.store.handleClose}
                >
                    <DialogTitle>
                        {offerId == null ? (
                            `Send a message to ${recipientUsername}`
                        ) : (
                            `Send a message about an offer`
                        )}
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            {`The deck name ${deckName == null ? "" : ` "${deckName}" `}and a link will be included in the message automatically.`}
                        </Typography>
                        <TextField
                            variant={"outlined"}
                            label={"Message"}
                            value={this.store.message}
                            onChange={(event) => this.store.message = event.target.value}
                            multiline={true}
                            rows={5}
                            fullWidth={true}
                            helperText={"We will send this message in an email, and give the recipient your email to reply."}
                            style={{marginTop: spacing(4)}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <KeyButton color={"primary"} onClick={this.store.handleClose}>Cancel</KeyButton>
                        <KeyButton
                            color={"primary"}
                            onClick={() => this.store.sendMessage(this.props)}
                            disabled={this.store.message.trim().length === 0 || emailStore.sendingSellerMessage}
                            loading={emailStore.sendingSellerMessage}
                        >
                            Send Message
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}
