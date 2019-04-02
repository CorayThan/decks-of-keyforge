import { Divider, IconButton, Menu, MenuItem } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar/AppBar"
import Drawer from "@material-ui/core/Drawer"
import Toolbar from "@material-ui/core/Toolbar/Toolbar"
import Typography from "@material-ui/core/Typography/Typography"
import { MoreVert } from "@material-ui/icons"
import MenuIcon from "@material-ui/icons/Menu"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { DeckImportPop } from "../decks/DeckImportPop"
import { DokIcon } from "../generic/icons/DokIcon"
import { PatronButton } from "../generic/PatronButton"
import { UnstyledLink } from "../generic/UnstyledLink"
import { LinkButton } from "../mui-restyled/LinkButton"
import { LinkMenuItem } from "../mui-restyled/LinkMenuItem"
import { Loader } from "../mui-restyled/Loader"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { screenStore } from "../ui/ScreenStore"
import { UiStore } from "../ui/UiStore"
import { LoginPop } from "../user/LoginPop"
import { userStore } from "../user/UserStore"
import { HamburgerOpen } from "./KeyDrawer"

class KeyTopbarStore {
    @observable
    displayLeftHamburger = false
}

export const keyTopbarStore = new KeyTopbarStore()

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
                <AppBar position={"fixed"} style={{zIndex: screenStore.zindexes.keyTopBar}}>
                    <Toolbar>
                        {keyTopbarStore.displayLeftHamburger && screenStore.screenSizeSm() ? <HamburgerOpen/> : null}
                        <UnstyledLink to={Routes.decks}><DokIcon/></UnstyledLink>
                        <Typography
                            variant={"h4"}
                            style={{marginLeft: spacing(2)}}
                            color={"inherit"}>
                            {screenStore.screenWidth < 1400 ? topbarShortName : topbarName}
                        </Typography>
                        {screenStore.screenWidth < 1600 ? null : subheaderNode}
                        <div style={{flexGrow: 1}}/>
                        <RightMenu/>
                    </Toolbar>
                </AppBar>
                <ToolbarSpacer/>
            </div>
        )
    }
}

class RightMenuStore {
    @observable
    open = false

    close = () => {
        this.open = false
    }
}

const rightMenuStore = new RightMenuStore()

@observer
class RightMenu extends React.Component {

    render() {
        if (screenStore.screenSizeMd()) {
            return (
                <>
                    <IconButton
                        onClick={() => rightMenuStore.open = !rightMenuStore.open}
                        color={"inherit"}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <Drawer
                        open={rightMenuStore.open}
                        onClose={rightMenuStore.close}
                        anchor={"right"}
                        style={{zIndex: screenStore.zindexes.rightMenu}}
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
            onClick={rightMenuStore.close}
        >
            Decks
        </LinkButton>
        <LinkButton
            style={{margin: spacing(1)}}
            color={"inherit"}
            to={Routes.cards}
            onClick={rightMenuStore.close}
        >
            Cards
        </LinkButton>
        <LinkButton
            style={{margin: spacing(1)}}
            color={"inherit"}
            to={StatsSubPaths.winRates}
            onClick={rightMenuStore.close}
        >
            Stats
        </LinkButton>
        <LinkButton
            style={{margin: spacing(1)}}
            color={"inherit"}
            to={Routes.articles}
            onClick={rightMenuStore.close}
        >
            Articles
        </LinkButton>
        <DeckImportPop
            style={{margin: spacing(1), display: "flex", justifyContent: "center"}}
        />
        <LinkButton
            style={{margin: spacing(1)}}
            color={"inherit"}
            to={AboutSubPaths.sas}
            onClick={rightMenuStore.close}
        >
            About
        </LinkButton>
    </>
)

@observer
class UserLinks extends React.Component {

    @observable
    buttonAnchor?: HTMLElement

    render() {
        if (userStore.loginInProgress) {
            return <Loader/>
        } else if (userStore.loggedIn()) {
            return (
                <>
                    <LinkButton
                        color={"inherit"}
                        to={Routes.usersDecks()}
                        style={{margin: spacing(1)}}
                        onClick={rightMenuStore.close}
                    >
                        My Decks
                    </LinkButton>
                    <div style={{margin: spacing(1)}}>
                        <PatronButton primary={screenStore.screenSizeMd()}/>
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <IconButton
                            color={"inherit"}
                            onClick={(event) => this.buttonAnchor = event.currentTarget}
                        >
                            <MoreVert/>
                        </IconButton>
                    </div>
                    <Menu
                        open={this.buttonAnchor != null}
                        onClose={() => this.buttonAnchor = undefined}
                        anchorEl={this.buttonAnchor}
                        style={{zIndex: screenStore.zindexes.menuPops}}
                    >
                        <LinkMenuItem
                            to={Routes.myProfile}
                            style={{margin: spacing(1)}}
                            onClick={() => {
                                rightMenuStore.close()
                                this.buttonAnchor = undefined
                            }}
                        >
                            Profile
                        </LinkMenuItem>
                        <MenuItem
                            onClick={() => {
                                rightMenuStore.close()
                                this.buttonAnchor = undefined
                                userStore.logout()
                            }}
                            style={{margin: spacing(1)}}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </>
            )
        } else {
            return (
                <>
                    <LoginPop
                        style={{margin: spacing(1), display: "flex", justifyContent: "center"}}
                    />
                    <LinkButton
                        color={"secondary"}
                        variant={"contained"}
                        to={Routes.registration}
                        style={{margin: spacing(1)}}
                        onClick={rightMenuStore.close}
                    >
                        Sign Up
                    </LinkButton>
                </>
            )
        }
    }
}

export const KeyTopbar = withRouter(KeyTopbarPlain)
