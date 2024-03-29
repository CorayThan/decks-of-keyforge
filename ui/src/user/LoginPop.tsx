import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Popover, TextField } from "@material-ui/core"
import { Visibility, VisibilityOff } from "@material-ui/icons"
import { makeObservable, observable } from "mobx"
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
    showPassword = false
    @observable
    email = Utils.isDev() ? "coraythan@gmail.com" : ""
    @observable
    password = Utils.isDev() ? "stuffstuff" : ""

    constructor(props: { style?: React.CSSProperties }) {
        super(props)
        makeObservable(this)
    }

    componentDidMount() {
        userStore.loginInProgress = false
        this.popOpen = false
    }

    login = (submitEvent: React.FormEvent) => {
        submitEvent.preventDefault()
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
                    <form
                        style={{padding: spacing(2), display: "flex", flexDirection: "column"}}
                        onSubmit={this.login}
                    >
                        <TextField
                            id={"dok-email"}
                            name={"dok-email"}
                            variant={"outlined"}
                            label={"Email"}
                            value={this.email}
                            onChange={(event) => this.email = event.target.value}
                            style={{marginBottom: spacing(2)}}
                            autoFocus={true}
                        />
                        <FormControl
                            variant={"outlined"}
                            style={{marginBottom: spacing(2)}}
                        >
                            <InputLabel htmlFor="dok-password">Password</InputLabel>
                            <OutlinedInput
                                id={"dok-password"}
                                name={"dok-password"}
                                type={this.showPassword ? "text" : "password"}
                                value={this.password}
                                onChange={(event) => this.password = event.target.value}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => this.showPassword = !this.showPassword}
                                            onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                                        >
                                            {this.showPassword ? <Visibility/> : <VisibilityOff/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                        </FormControl>
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
                                type={"submit"}
                                loading={userStore.loginInProgress}
                            >
                                Login
                            </KeyButton>
                        </div>
                        <div style={{display: "flex", marginTop: spacing(2)}}>
                            <LinkButton
                                href={Routes.forgotPassword}
                                size={"small"}
                                onClick={this.handlePopoverClose}
                            >
                                Reset Password
                            </LinkButton>
                        </div>
                    </form>
                </Popover>
            </>
        )
    }
}
