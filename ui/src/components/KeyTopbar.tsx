import { Divider, IconButton, List, ListItem, ListItemText } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar/AppBar"
import Collapse from "@material-ui/core/Collapse"
import { blue } from "@material-ui/core/colors"
import Drawer from "@material-ui/core/Drawer"
import Toolbar from "@material-ui/core/Toolbar/Toolbar"
import Typography from "@material-ui/core/Typography/Typography"
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import MenuIcon from "@material-ui/icons/Menu"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { AboutSubPaths, MyDokSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { DeckImportPop } from "../decks/DeckImportPop"
import { randomDeckMenuItem } from "../decks/RandomDeckFinder"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DeckOrCardSearchSuggest } from "../decks/search/DeckOrCardSearchSuggest"
import { DokIcon } from "../generic/icons/DokIcon"
import { PatreonIcon } from "../generic/icons/PatreonIcon"
import { LinkMenu, LinkMenuStore } from "../generic/LinkMenu"
import { UnstyledLink } from "../generic/UnstyledLink"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton, ListItemLink } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { LoginPop } from "../user/LoginPop"
import { userStore } from "../user/UserStore"
import { ShareButton } from "./ShareButton"

class KeyTopbarStore {
    @observable
    displayLeftHamburger = false
}

export const keyTopbarStore = new KeyTopbarStore()

interface KeyTopbarProps extends RouteComponentProps<{}> {
}

const myDeckLinks = () => [
    {to: Routes.usersDecks(), text: "My Decks", mobileActive: true},
    {to: Routes.usersCota(), text: "My COTA"},
    {to: Routes.usersAoa(), text: "My AOA"},
    {to: Routes.usersWc(), text: "My WC"},
    {to: Routes.usersFavorites(), text: "My Favorites"},
    {to: Routes.userDecksForSale(userStore.username!), text: "For Sale"},
    {to: Routes.usersDecksNotForSale(), text: "Not For Sale"},
    {to: Routes.sellersView(), text: "Sellers View", onClick: () => keyLocalStorage.setDeckListViewType("table")},
]

export enum MenuStoreName {
    DECKS,
    MY_DECKS,
    CARDS,
    STATS,
    ABOUT,
    MY_DOK
}

const decksMenuStore = new LinkMenuStore(MenuStoreName.DECKS)
const myDecksMenuStore = new LinkMenuStore(MenuStoreName.MY_DECKS)
const cardsMenuStore = new LinkMenuStore(MenuStoreName.CARDS)
const statsMenuStore = new LinkMenuStore(MenuStoreName.STATS)
const aboutMenuStore = new LinkMenuStore(MenuStoreName.ABOUT)
const myDokMenuStore = new LinkMenuStore(MenuStoreName.MY_DOK)

export const closeAllMenuStoresExcept = (except?: MenuStoreName) => {
    const closeThese: LinkMenuStore[] = []
    if (except !== MenuStoreName.DECKS) {
        closeThese.push(decksMenuStore)
    }
    if (except !== MenuStoreName.MY_DECKS) {
        closeThese.push(myDecksMenuStore)
    }
    if (except !== MenuStoreName.CARDS) {
        closeThese.push(cardsMenuStore)
    }
    if (except !== MenuStoreName.STATS) {
        closeThese.push(statsMenuStore)
    }
    if (except !== MenuStoreName.ABOUT) {
        closeThese.push(aboutMenuStore)
    }
    if (except !== MenuStoreName.MY_DOK) {
        closeThese.push(myDokMenuStore)
    }
    closeThese.forEach(toClose => toClose.handleClose())
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
        if (screenStore.smallScreenTopBar()) {
            menuContents = (
                <>
                    <div style={{marginRight: spacing(2)}}>
                        <UnstyledLink to={Routes.landing}><DokIcon/></UnstyledLink>
                    </div>
                    <Typography
                        variant={screenStore.screenSizeXs() ? "h5" : "h4"}
                        color={"inherit"}>
                        {screenStore.screenWidth < 800 ? topbarShortName : topbarName}
                    </Typography>
                    <div style={{flexGrow: 1}}/>
                    <DeckOrCardSearchSuggest placement={"bottom-end"}/>
                    {screenStore.screenWidth > 1000 && (
                        <>
                            <LinkMenu
                                genericOnClick={rightMenuStore.close}
                                links={[
                                    {to: Routes.decks, text: "Decks", mobileActive: true},
                                    {to: Routes.deckSearch(DeckFilters.forSaleOrTrade()), text: "For Sale"},
                                    randomDeckMenuItem,
                                ]}
                                style={{margin: spacing(1)}}
                                dropdownOnly={true}
                                linkMenuStore={decksMenuStore}
                            />
                            {userStore.loggedIn() && (
                                <>
                                    <LinkMenu
                                        genericOnClick={rightMenuStore.close}
                                        links={myDeckLinks()}
                                        style={{margin: spacing(1)}}
                                        dropdownOnly={true}
                                        linkMenuStore={myDecksMenuStore}
                                    />
                                    <MyDokDropdown/>
                                </>
                            )}
                        </>
                    )}
                    {screenStore.smallDeckView() && (
                        <ShareButton
                            url={window.location.href}
                            title={topbarName}
                        />
                    )}
                    <RightMenu/>
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
                    {screenStore.screenWidth < 2000 ? null : subheaderNode}
                    <div style={{flexGrow: 1}}/>
                    <DeckOrCardSearchSuggest placement={"bottom-start"}/>
                    <RightMenu/>
                </>
            )
        }

        return (
            <div>
                <AppBar
                    position={"fixed"}
                    style={{zIndex: screenStore.zindexes.keyTopBar, background: themeStore.darkMode ? blue["800"] : undefined}}
                >
                    <Toolbar
                        style={{
                            paddingLeft: screenStore.smallDeckView() ? spacing(2) : undefined,
                            paddingRight: screenStore.smallDeckView() ? spacing(2) : undefined
                        }}
                    >
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

    @observable
    aboutOpen = false

    close = () => {
        this.open = false
        this.aboutOpen = false
    }
}

export const rightMenuStore = new RightMenuStore()

@observer
class RightMenu extends React.Component {

    render() {
        if (screenStore.smallScreenTopBar()) {
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
                        <div style={{display: "flex", flexDirection: "column", minWidth: 160}}>
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
                    <UserLinksDesktop/>
                </div>
            </>
        )
    }
}

const AppLinks = observer(() => (
    <>
        <LinkMenu
            genericOnClick={rightMenuStore.close}
            links={[
                {to: Routes.decks, text: "Decks", mobileActive: true},
                {to: Routes.deckSearch(DeckFilters.forSaleOrTrade()), text: "For Sale"},
                randomDeckMenuItem,
            ]}
            style={{margin: spacing(1)}}
            linkMenuStore={decksMenuStore}
        >
            <DeckImportPop/>
        </LinkMenu>
        <LinkMenu
            genericOnClick={rightMenuStore.close}
            links={[
                {to: Routes.cards, text: "Cards", mobileActive: true},
                {to: Routes.spoilers, text: "Mass Mutation Cards", mobileActive: true},
                {to: Routes.cotaCards, text: "CotA Cards", mobileActive: false},
                {to: Routes.aoaCards, text: "AoA Cards", mobileActive: false},
                {to: Routes.wcCards, text: "WC Cards", mobileActive: false},
                {to: Routes.createSpoiler, text: "Create Spoiler", contentCreatorOnly: true, mobileActive: true},
            ]}
            style={{margin: spacing(1)}}
            linkMenuStore={cardsMenuStore}
        />
        {screenStore.smallScreenTopBar() ? (
            <ListItemLink onClick={rightMenuStore.close} to={Routes.users} primary={"Users"}/>
        ) : (
            <LinkButton
                to={Routes.users}
                color={"inherit"}
                style={{marginLeft: spacing(1)}}
            >
                Users
            </LinkButton>
        )}
        <LinkMenu
            genericOnClick={rightMenuStore.close}
            links={[
                {to: StatsSubPaths.winRates, text: "Stats", mobileActive: true},
                {to: StatsSubPaths.deckStats, text: "Deck Stats", mobileActive: false},
                {to: StatsSubPaths.aercStats, text: "AERC Stats", mobileActive: false},
                {to: Routes.articles, text: "Articles", mobileActive: true},
            ]}
            style={{margin: spacing(1)}}
            linkMenuStore={statsMenuStore}
        />
        {screenStore.smallScreenTopBar() ? (
            <>
                <ListItem
                    button={true}
                    onClick={() => rightMenuStore.aboutOpen = !rightMenuStore.aboutOpen}
                >
                    <ListItemText primary={"About"}/>
                    {rightMenuStore.aboutOpen ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={rightMenuStore.aboutOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemLink
                            to={AboutSubPaths.sas}
                            onClick={rightMenuStore.close}
                            primary={"SAS and AERC"}
                        />
                        <ListItemLink
                            to={AboutSubPaths.contact}
                            onClick={rightMenuStore.close}
                            primary={"Contact Me"}
                        />
                        <ListItemLink
                            to={AboutSubPaths.releaseNotes}
                            onClick={rightMenuStore.close}
                            primary={"Release Notes"}
                        />
                        <ListItemLink
                            to={AboutSubPaths.sellersAndDevs}
                            onClick={rightMenuStore.close}
                            primary={"APIs"}
                        />
                        <ListItemLink
                            to={AboutSubPaths.teamSas}
                            onClick={rightMenuStore.close}
                            primary={"Team SAS-LP"}
                        />
                    </List>
                </Collapse>
            </>
        ) : (
            <LinkMenu
                genericOnClick={rightMenuStore.close}
                links={[
                    {to: AboutSubPaths.sas, text: "About", mobileActive: true},
                    {to: AboutSubPaths.sas, text: "SAS and AERC"},
                    {to: AboutSubPaths.patreon, text: "Patron Rewards"},
                    {to: AboutSubPaths.contact, text: "Contact Me"},
                    {to: AboutSubPaths.releaseNotes, text: "Release Notes"},
                    {to: AboutSubPaths.sellersAndDevs, text: "APIs"},
                    {to: AboutSubPaths.teamSas, text: "Team SAS-LP"},
                ]}
                style={{margin: spacing(1)}}
                linkMenuStore={aboutMenuStore}
            />
        )}
    </>
))

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
                        links={myDeckLinks()}
                        style={{margin: spacing(1)}}
                        linkMenuStore={myDecksMenuStore}
                    />
                    <ListItemLink
                        to={Routes.myProfile}
                        onClick={rightMenuStore.close}
                        primary={"My DoK"}
                    />
                    <ListItemLink
                        to={AboutSubPaths.patreon}
                        onClick={rightMenuStore.close}
                        primary={"Patreon"}
                        icon={<PatreonIcon primary={true}/>}
                    />
                    <ListItem
                        button={true}
                        onClick={() => {
                            userStore.logout()
                            rightMenuStore.close()
                        }}
                    >
                        <ListItemText primary={"Logout"}/>
                    </ListItem>
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

@observer
class UserLinksDesktop extends React.Component {

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
                        links={myDeckLinks()}
                        style={{margin: spacing(1)}}
                        linkMenuStore={myDecksMenuStore}
                    />
                    <MyDokDropdown/>
                    <LinkButton
                        color={"inherit"}
                        to={AboutSubPaths.patreon}
                        style={{margin: spacing(1)}}
                        onClick={rightMenuStore.close}
                    >
                        <PatreonIcon style={{marginRight: spacing(1)}} primary={screenStore.smallScreenTopBar()}/>
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

const MyDokDropdown = () => (
    <LinkMenu
        genericOnClick={rightMenuStore.close}
        links={[
            {to: Routes.myProfile, text: "My DoK", mobileActive: true},
            {to: Routes.myProfile, text: "Profile", mobileActive: false},
            {to: MyDokSubPaths.offers, text: "Offers", mobileActive: false},
            {to: MyDokSubPaths.purchases, text: "Bought / Sold", mobileActive: false},
            {to: MyDokSubPaths.notifications, text: "Notifications", mobileActive: false},
        ]}
        style={{margin: spacing(1)}}
        dropdownOnly={true}
        linkMenuStore={myDokMenuStore}
    />
)

export const KeyTopbar = withRouter(KeyTopbarPlain)
