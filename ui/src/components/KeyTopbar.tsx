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
import { AboutSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { DeckImportPop } from "../decks/DeckImportPop"
import { randomDeckMenuItem } from "../decks/RandomDeckFinder"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DokIcon } from "../generic/icons/DokIcon"
import { PatreonIcon } from "../generic/icons/PatreonIcon"
import { LinkMenu } from "../generic/LinkMenu"
import { UnstyledLink } from "../generic/UnstyledLink"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { LoginPop } from "../user/LoginPop"
import { userStore } from "../user/UserStore"

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
        const {topbarName, topbarShortName, topbarSubheader} = uiStore

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

        let menuContents
        if (screenStore.screenSizeMd()) {
            menuContents = (
                <>
                    <RightMenu/>
                    <Typography
                        variant={"h4"}
                        style={{marginLeft: spacing(2)}}
                        color={"inherit"}>
                        {screenStore.screenWidth < 440 ? topbarShortName : topbarName}
                    </Typography>
                    {screenStore.screenWidth < 800 ? null : subheaderNode}
                    <div style={{flexGrow: 1}}/>
                    <div style={{marginLeft: spacing(2), marginRight: spacing(2)}}>
                        <UnstyledLink to={Routes.landing}><DokIcon/></UnstyledLink>
                    </div>
                </>
            )
        } else {
            menuContents = (
                <>
                    <UnstyledLink to={Routes.landing}><DokIcon/></UnstyledLink>
                    <Typography
                        variant={"h4"}
                        style={{marginLeft: spacing(2)}}
                        color={"inherit"}>
                        {screenStore.screenWidth < 1480 ? topbarShortName : topbarName}
                    </Typography>
                    {screenStore.screenWidth < 1700 ? null : subheaderNode}
                    <div style={{flexGrow: 1}}/>
                    <RightMenu/>
                </>
            )
        }

        return (
            <div>
                <AppBar position={"fixed"} style={{zIndex: screenStore.zindexes.keyTopBar}}>
                    <Toolbar>
                        {menuContents}
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
                        anchor={"left"}
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
        <LinkMenu
            genericOnClick={rightMenuStore.close}
            links={[
                {to: Routes.decks, text: "Decks", mobileActive: true},
                {to: Routes.deckSearch(DeckFilters.forSaleOrTrade()), text: "For Sale"},
                randomDeckMenuItem,
            ]}
            style={{margin: spacing(1)}}
        />
        <DeckImportPop
            style={{margin: spacing(1), display: "flex", justifyContent: "center"}}
        />
        <LinkMenu
            genericOnClick={rightMenuStore.close}
            links={[
                {to: Routes.landing, text: "Home", mobileActive: true},
                {to: Routes.cards, text: "Cards", mobileActive: true},
                {to: StatsSubPaths.winRates, text: "Stats", mobileActive: true},
                {to: Routes.articles, text: "Articles", mobileActive: true},
            ]}
            style={{margin: spacing(1)}}
        />
        <LinkMenu
            genericOnClick={rightMenuStore.close}
            links={[
                {to: AboutSubPaths.sas, text: "About", mobileActive: true},
                {to: AboutSubPaths.sas, text: "SAS and AERC"},
                {to: AboutSubPaths.contact, text: "Contact Me"},
                {to: AboutSubPaths.releaseNotes, text: "Release Notes"},
                {to: AboutSubPaths.sellersAndDevs, text: "APIs"},
            ]}
            style={{margin: spacing(1)}}
        />
    </>
)

@observer
class UserLinks extends React.Component {

    @observable
    buttonAnchor?: HTMLElement

    render() {
        if (!userStore.loggedIn() && userStore.loginInProgress) {
            return <Loader/>
        } else if (userStore.loggedIn()) {
            return (
                <>
                    <LinkMenu
                        genericOnClick={rightMenuStore.close}
                        links={[
                            {to: Routes.usersDecks(), text: "My Decks", mobileActive: true},
                            {to: Routes.usersFavorites(), text: "My Favorites"},
                            {to: Routes.userDecksForSale(userStore.username!), text: "For Sale"},
                            {to: Routes.usersDecksNotForSale(), text: "Not For Sale"},
                            {to: Routes.sellersView(), text: "Sellers View"},
                        ]}
                        style={{margin: spacing(1)}}
                    />
                    <LinkButton
                        color={"inherit"}
                        to={Routes.myProfile}
                        style={{margin: spacing(1)}}
                        onClick={rightMenuStore.close}
                    >
                        Profile
                    </LinkButton>
                    <LinkButton
                        color={"inherit"}
                        to={AboutSubPaths.patreon}
                        style={{margin: spacing(1)}}
                        onClick={rightMenuStore.close}
                    >
                        <PatreonIcon style={{marginRight: spacing(1)}} primary={screenStore.screenSizeMd()}/>
                        Patron Rewards
                    </LinkButton>
                    <KeyButton
                        outlinedWhite={true}
                        color={"inherit"}
                        onClick={userStore.logout}
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
