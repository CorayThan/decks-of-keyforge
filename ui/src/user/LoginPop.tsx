import { Button, Popover, TextField } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Utils } from "../config/Utils"
import { KeyButton } from "../mui-restyled/KeyButton"
import { UserStore } from "./UserStore"

@observer
export class LoginPop extends React.Component<{style?: React.CSSProperties}> {

    @observable
    popOpen = false
    anchorElement?: HTMLDivElement

    @observable
    email = Utils.isDev() ? "coraythan@gmail.com" : ""
    @observable
    password = Utils.isDev() ? "stuffstuff" : ""

    componentDidMount() {
        UserStore.instance.loginInProgress = false
        this.popOpen = false
    }

    login = () => {
        UserStore.instance.login({email: this.email, password: this.password})
    }

    handlePopoverOpen = (event: React.MouseEvent<HTMLInputElement>) => {
        this.popOpen = true
    }

    handlePopoverClose = () => {
        this.popOpen = false
    }

    render() {
        if (UserStore.instance.user) {
            return null
        }
        return (
            <div style={this.props.style}>
                <div
                    ref={(ref: HTMLDivElement) => this.anchorElement = ref}
                >
                    <KeyButton
                        outlinedWhite={true}
                        color={"inherit"}
                        style={{marginRight: spacing(2)}}
                        onClick={this.handlePopoverOpen}
                    >
                        Sign In
                    </KeyButton>
                </div>
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
                    style={{zIndex: 12000}}
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
                                loading={UserStore.instance.loginInProgress}
                            >
                                Login
                            </KeyButton>
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }
}
