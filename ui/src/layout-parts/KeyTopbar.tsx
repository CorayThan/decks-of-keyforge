import AppBar from "@material-ui/core/AppBar/AppBar"
import Toolbar from "@material-ui/core/Toolbar/Toolbar"
import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DokIcon } from "../generic/icons/DokIcon"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { ScreenStore } from "../ui/ScreenStore"
import { UiStore } from "../ui/UiStore"
import { LoginPop } from "../user/LoginPop"
import { UserStore } from "../user/UserStore"

interface KeyTopbarProps extends RouteComponentProps<{}> {
}

@observer
class KeyTopbarPlain extends React.Component<KeyTopbarProps> {

    render() {
        const {topbarName, topbarShortName, topbarSubheader} = UiStore.instance

        let subheaderNode
        if (topbarSubheader) {
            subheaderNode = (
                <Typography
                    variant={"subtitle1"}
                    style={{marginLeft: spacing(2), marginTop: 12}}
                    color={"inherit"}>
                    {topbarSubheader}
                </Typography>
            )
        }

        let rightContent
        let farRightContent = null

        if (UserStore.instance.loginInProgress) {
            rightContent = (<Loader/>)
        } else if (UserStore.instance.loggedIn()) {
            rightContent = (
                <KeyButton
                    variant={"outlined"}
                    color={"inherit"}
                    onClick={UserStore.instance.logout}
                >
                    Logout
                </KeyButton>
            )
        } else {
            rightContent = (
                <LoginPop/>
            )
            farRightContent = (
                <LinkButton
                    color={"secondary"}
                    variant={"contained"}
                    to={Routes.registration}
                >
                    Sign Up
                </LinkButton>
            )
        }

        return (
            <div>
                <AppBar position={"fixed"} style={{zIndex: 10000}}>
                    <Toolbar>
                        <DokIcon/>
                        <Typography
                            variant={"h4"}
                            style={{marginLeft: spacing(2)}}
                            color={"inherit"}>
                            {ScreenStore.instance.screenSizeXs() ? topbarShortName : topbarName}
                        </Typography>
                        {ScreenStore.instance.screenWidth < 1024 ? null : subheaderNode}
                        <div
                            style={{flexGrow: 1}}
                        />
                        <LinkButton
                            color={"inherit"}
                            to={Routes.cards}
                        >
                            Cards
                        </LinkButton>
                        <LinkButton
                            color={"inherit"}
                            style={{marginLeft: spacing(2)}}
                            to={Routes.decks}
                        >
                            Decks
                        </LinkButton>
                        <div
                            style={{borderLeft: "1px solid rgba(0, 0, 0, 0.12", marginLeft: spacing(2), paddingLeft: spacing(4)}}
                        >
                            {rightContent}
                        </div>
                        {farRightContent}
                    </Toolbar>
                </AppBar>
                <ToolbarSpacer/>
            </div>
        )
    }
}

export const KeyTopbar = withRouter(KeyTopbarPlain)
