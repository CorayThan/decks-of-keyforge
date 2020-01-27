import { Typography } from "@material-ui/core"
import { amber } from "@material-ui/core/colors"
import IconButton from "@material-ui/core/IconButton/IconButton"
import Snackbar from "@material-ui/core/Snackbar/Snackbar"
import CloseIcon from "@material-ui/icons/Close"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { theme, themeStore } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
import { LinkButton } from "../mui-restyled/LinkButton"

export type MessageType = "Error" | "Warn" | "Success"

export class MessageStore {

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

    setRequestErrorMessage = () => this.setMessage("There was an unexpected error making your request.", "Error")

    setErrorMessage = (message: string) => this.setMessage(message, "Error")
    setWarningMessage = (message: string, durationMs?: number) => this.setMessage(message, "Warn", undefined, durationMs)
    setSuccessMessage = (message: string, durationMs?: number) => this.setMessage(message, "Success", undefined, durationMs)

    setReleaseMessage = (version: string) => {
        messageStore.setMessage(`Version ${version} has been released!`, "Success", (
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
        this.message = message
        this.messageType = messageType
        this.action = action
        this.open = true
        this.hideDuration = duration ? duration : 6000
    }
}

@observer
export class SnackMessage extends React.Component {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleClose = (event: any, reason?: string) => {
        if (reason === "clickaway") {
            return
        }
        messageStore.open = false
    }

    colorFromMessageType = (messageType: MessageType) => {
        if (messageType === "Warn") {
            return amber[700]
        } else if (messageType === "Error") {
            return theme.palette.error.dark
        } else if (messageType === "Success") {
            return theme.palette.primary.dark
        }
        return undefined
    }

    render() {
        const {message} = messageStore

        const actions = []

        if (messageStore.action) {
            actions.push((
                messageStore.action
            ))
        }

        actions.push((
            <IconButton
                key="close"
                aria-label="Close"
                color={themeStore.darkMode ? "default" : "inherit"}
                style={{padding: theme.spacing(1) / 2}}
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
                open={messageStore.open}
                autoHideDuration={messageStore.hideDuration}
                onClose={this.handleClose}
                ContentProps={{
                    "aria-describedby": "message-id",
                    "style": {backgroundColor: this.colorFromMessageType(messageStore.messageType)}
                }}
                message={<span id="message-id"><Typography color={themeStore.darkMode ? "textPrimary" : "inherit"}>{message}</Typography></span>}
                action={actions}
            />
        )
    }
}

export const messageStore = new MessageStore()
