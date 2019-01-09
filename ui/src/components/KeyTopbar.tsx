import { Divider, IconButton } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar/AppBar"
import Drawer from "@material-ui/core/Drawer"
import Toolbar from "@material-ui/core/Toolbar/Toolbar"
import Typography from "@material-ui/core/Typography/Typography"
import MenuIcon from "@material-ui/icons/Menu"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DeckImportPop } from "../decks/DeckImportPop"
import { DokIcon } from "../generic/icons/DokIcon"
import { UnstyledLink } from "../generic/UnstyledLink"
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

        return (
            <div>
                <AppBar position={"fixed"} style={{zIndex: 9000}}>
                    <Toolbar>
                        <UnstyledLink to={Routes.decks}><DokIcon/></UnstyledLink>
                        <Typography
                            variant={"h4"}
                            style={{marginLeft: spacing(2)}}
                            color={"inherit"}>
                            {ScreenStore.instance.screenSizeXs() ? topbarShortName : topbarName}
                        </Typography>
                        {ScreenStore.instance.screenWidth < 1280 ? null : subheaderNode}
                        <div style={{flexGrow: 1}}/>
                        <RightMenu/>
                    </Toolbar>
                </AppBar>
                <ToolbarSpacer/>
            </div>
        )
    }
}

@observer
class RightMenu extends React.Component {

    @observable
    open = false

    render() {
        if (ScreenStore.instance.screenSizeSm()) {
            return (
                <>
                    <IconButton
                        onClick={() => this.open = !this.open}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <Drawer
                        open={this.open}
                        onClose={() => this.open = false}
                        anchor={"right"}
                        style={{zIndex: 11000}}
                    >
                        <div style={{display: "flex", padding: spacing(2), flexDirection: "column"}}>
                            <AppLinks/>
                            <Divider style={{margin: spacing(2)}}/>
                            <UserLinks/>
                        </div>
                    </Drawer>

                </>
            )
        }

        return (
            <>
                <AppLinks/>
                <div
                    style={{display: "flex", borderLeft: "1px solid rgb(255, 255, 255, 0.25)", marginLeft: spacing(2), paddingLeft: spacing(2)}}
                >
                    <UserLinks/>
                </div>
            </>
        )
    }
}

const AppLinks = () => (
    <>
        <LinkButton
            color={"inherit"}
            style={{margin: spacing(1)}}
            to={Routes.decks}
        >
            Decks
        </LinkButton>
        <LinkButton
            style={{margin: spacing(1)}}
            color={"inherit"}
            to={Routes.cards}
        >
            Cards
        </LinkButton>
        <DeckImportPop
            style={{margin: spacing(1)}}
        />
        <LinkButton
            style={{margin: spacing(1)}}
            color={"inherit"}
            to={Routes.about}
        >
            About
        </LinkButton>
    </>
)

@observer
class UserLinks extends React.Component {
    render() {
        if (UserStore.instance.loginInProgress) {
            return <Loader/>
        } else if (UserStore.instance.loggedIn()) {
            return (
                <>
                    <LinkButton
                        color={"inherit"}
                        to={Routes.userProfilePage(UserStore.instance.user!.username)}
                        style={{margin: spacing(1)}}
                    >
                        Profile
                    </LinkButton>
                    <KeyButton
                        outlinedWhite={true}
                        color={"inherit"}
                        onClick={UserStore.instance.logout}
                        style={{margin: spacing(1)}}
                    >
                        Logout
                    </KeyButton>
                </>
            )
        } else {
            return (
                <>
                    <LoginPop
                        style={{margin: spacing(1)}}
                    />
                    <LinkButton
                        color={"secondary"}
                        variant={"contained"}
                        to={Routes.registration}
                        style={{margin: spacing(1)}}
                    >
                        Sign Up
                    </LinkButton>
                </>
            )
        }
    }
}

export const KeyTopbar = withRouter(KeyTopbarPlain)
