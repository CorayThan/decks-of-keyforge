import { Dialog, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { MessageStore } from "../ui/MessageStore"
import { emailStore } from "./EmailStore"

interface SendSellerEmailDialogProps {
    deckName: string
    keyforgeId: string
    senderUsername: string
    senderEmail: string
    username: string
}

@observer
export class SendSellerEmailDialog extends React.Component<SendSellerEmailDialogProps> {

    @observable
    open = false

    @observable
    message = ""

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
        this.message = ""
    }

    sendMessage = async () => {
        const {message} = this
        const {senderEmail, senderUsername, username, deckName, keyforgeId} = this.props
        if (message.trim().length === 0) {
            MessageStore.instance.setWarningMessage("Please include a message.")
            return
        }

        await emailStore.sendSellerMessage({
            username,
            deckName,
            deckKeyforgeId: keyforgeId,
            message,
            senderUsername,
            senderEmail
        })
        this.handleClose()
    }

    render() {
        const {username} = this.props

        return (
            <div>
                <KeyButton
                    onClick={this.handleOpen}
                >
                    Send Message
                </KeyButton>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Send a message to {username}</DialogTitle>
                    <DialogContent>
                        <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Important!</Typography>
                        <Typography>
                            Before you send this seller an email, please make sure they don't have a different preferred contact method in their contact
                            info.
                        </Typography>
                        <TextField
                            variant={"outlined"}
                            label={"Message"}
                            value={this.message}
                            onChange={(event) => this.message = event.target.value}
                            multiline={true}
                            rows={3}
                            fullWidth={true}
                            helperText={"We will send this message to the seller in an email, and give them your email to reply to your message."}
                            style={{marginTop: spacing(4)}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Cancel</KeyButton>
                        <KeyButton
                            color={"primary"}
                            onClick={this.sendMessage}
                            disabled={this.message.trim().length === 0 || emailStore.sendingSellerMessage}
                            loading={emailStore.sendingSellerMessage}
                        >
                            Send Message
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
