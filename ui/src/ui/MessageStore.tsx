import { amber, blue, red } from "@material-ui/core/colors"
import IconButton from "@material-ui/core/IconButton/IconButton"
import Snackbar from "@material-ui/core/Snackbar/Snackbar"
import CloseIcon from "@material-ui/icons/Close"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
import { log } from "../config/Utils"
import { LinkButton } from "../mui-restyled/LinkButton"

export type MessageType = "Error" | "Warn" | "Info" | "Success"

export class MessageStore {
    private static innerInstance: MessageStore

    @observable
    message = ""

    @observable
    action?: React.ReactNode

    @observable
    messageType: MessageType = "Success"

    @observable
    open = false

    @observable
    hideDuration = 6000

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    setRequestErrorMessage = () => this.setMessage("There was an unexpected error making your request.", "Error")

    setErrorMessage = (message: string) => this.setMessage(message, "Error")
    setWarningMessage = (message: string) => this.setMessage(message, "Warn")
    setSuccessMessage = (message: string) => this.setMessage(message, "Success")
    setInfoMessage = (message: string) => this.setMessage(message, "Info")

    setReleaseMessage = (version: string) => {
        MessageStore.instance.setMessage(`Version ${version} has been released!`, "Info", (
            <LinkButton
                color={"inherit"}
                to={AboutSubPaths.releaseNotes}
                key={"release-notes"}
                onClick={() => this.open = false}
            >
                Release Notes
            </LinkButton>
        ), 20000)
    }

    setMessage = (message: string, messageType: MessageType, action?: React.ReactNode, duration?: number) => {
        log.debug("Setting message to " + message)
        this.message = message
        this.messageType = messageType
        this.action = action
        this.open = true
        this.hideDuration = duration ? duration : 6000
    }
}

@observer
export class SnackMessage extends React.Component {

    // tslint:disable-next-line
    handleClose = (event: any, reason?: string) => {
        if (reason === "clickaway") {
            return
        }
        MessageStore.instance.open = false
    }

    colorFromMessageType = (messageType: MessageType) => {
        if (messageType === "Warn") {
            return amber[700]
        } else if (messageType === "Info") {
            return blue.A400
        } else if (messageType === "Error") {
            return red[700]
        }
        return undefined
    }

    render() {
        const {message} = MessageStore.instance

        log.debug(`In snack message with message ${message}`)

        const actions = []

        if (MessageStore.instance.action) {
            actions.push((
                MessageStore.instance.action
            ))
        }

        actions.push((
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                style={{padding: spacing(1) / 2}}
                onClick={this.handleClose}
            >
                <CloseIcon/>
            </IconButton>
        ))

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={MessageStore.instance.open}
                autoHideDuration={MessageStore.instance.hideDuration}
                onClose={this.handleClose}
                ContentProps={{
                    "aria-describedby": "message-id",
                    "style": {backgroundColor: this.colorFromMessageType(MessageStore.instance.messageType)}
                }}
                message={<span id="message-id">{message}</span>}
                action={actions}
            />
        )
    }
}
