import { Button, Popover, TextField } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "./UserStore"

@observer
export class LoginPop extends React.Component<{ style?: React.CSSProperties }> {

    @observable
    popOpen = false
    anchorElement?: HTMLButtonElement

    @observable
    email = Utils.isDev() ? "coraythan@gmail.com" : ""
    @observable
    password = Utils.isDev() ? "stuffstuff" : ""

    componentDidMount() {
        userStore.loginInProgress = false
        this.popOpen = false
    }

    login = () => {
        userStore.login({email: this.email, password: this.password})
    }

    handlePopoverOpen = () => {
        this.popOpen = true
    }

    handlePopoverClose = () => {
        this.popOpen = false
    }

    render() {
        if (userStore.user) {
            return null
        }
        return (
            <>
                <Button
                    ref={(ref: HTMLButtonElement) => this.anchorElement = ref}
                    variant={"outlined"}
                    color={"inherit"}
                    onClick={this.handlePopoverOpen}
                    style={this.props.style}
                >
                    Sign In
                </Button>
                <Popover
                    open={this.popOpen}
                    onClose={this.handlePopoverClose}
                    anchorEl={this.anchorElement}
                    anchorPosition={{top: 500, left: 400}}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    style={{zIndex: screenStore.zindexes.menuPops}}
                >
                    <div style={{padding: spacing(2), display: "flex", flexDirection: "column"}}>
                        <TextField
                            variant={"outlined"}
                            label={"Email"}
                            value={this.email}
                            onChange={(event) => this.email = event.target.value}
                            style={{marginBottom: spacing(2)}}
                            autoFocus={true}
                        />
                        <TextField
                            variant={"outlined"}
                            label={"Password"}
                            type={"password"}
                            value={this.password}
                            onChange={(event) => this.password = event.target.value}
                            style={{marginBottom: spacing(2)}}
                        />
                        <div style={{display: "flex"}}>
                            <Button
                                variant={"outlined"}
                                style={{marginRight: spacing(2)}}
                                onClick={this.handlePopoverClose}
                            >
                                Cancel
                            </Button>
                            <div style={{flexGrow: 1}}/>
                            <KeyButton
                                variant={"contained"}
                                color={"primary"}
                                onClick={this.login}
                                loading={userStore.loginInProgress}
                            >
                                Login
                            </KeyButton>
                        </div>
                        <div style={{display: "flex", marginTop: spacing(2)}}>
                            <LinkButton
                                to={Routes.forgotPassword}
                                size={"small"}
                                onClick={this.handlePopoverClose}
                            >
                                Forgot Password?
                            </LinkButton>
                        </div>
                    </div>
                </Popover>
            </>
        )
    }
}
