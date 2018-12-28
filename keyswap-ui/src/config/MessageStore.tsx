import IconButton from "@material-ui/core/IconButton/IconButton"
import Snackbar from "@material-ui/core/Snackbar/Snackbar"
import CloseIcon from "@material-ui/icons/Close"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "./MuiConfig"
import { log } from "./Utils"

export type MessageType = "Error" | "Info"

export class MessageStore {
    private static innerInstance: MessageStore

    @observable
    message = ""

    @observable
    messageType?: MessageType

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    setRequestErrorMessage = () => this.setMessage("There was an unexpected error making your request.", "Error")

    setErrorMessage = (message: string) => this.setMessage(message, "Error")

    setSuccessMessage = (message: string) => this.setMessage(message, "Info")

    setMessage = (message: string, messageType?: MessageType) => {
        this.message = message
        this.messageType = messageType
    }
}

@observer
export class SnackMessage extends React.Component {

    // tslint:disable-next-line
    handleClose = (event: any, reason?: string) => {
        if (reason === "clickaway") {
            return
        }

        MessageStore.instance.setMessage("", undefined)
    }

    render() {
        const {message, messageType} = MessageStore.instance

        log.debug(`In snack message with message ${message}`)
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={message.length > 0}
                autoHideDuration={6000}
                onClose={this.handleClose}
                ContentProps={{
                    "aria-describedby": "message-id",
                }}
                // style={{backgroundColor: messageType === "Error" ? muiTheme.palette.error.dark : undefined}}
                message={<span id="message-id">{message}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        style={{padding: spacing(1) / 2}}
                        onClick={this.handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>,
                ]}
            />
        )
    }
}
