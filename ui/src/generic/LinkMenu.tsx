import { Grow, ListItem, ListItemText, MenuList, Paper, Popper } from "@material-ui/core"
import { MenuItemProps } from "@material-ui/core/MenuItem"
import { ArrowDropDown } from "@material-ui/icons"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { closeAllMenuStoresExcept, MenuStoreName } from "../components/KeyTopbar"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { deckStore } from "../decks/DeckStore"
import { LinkButton, ListItemLink } from "../mui-restyled/LinkButton"
import { LinkMenuItem } from "../mui-restyled/LinkMenuItem"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"

export interface LinkInfo {
    to?: string
    component?: React.ElementType<MenuItemProps>
    onClick?: () => void
    text: string
    mobileActive?: boolean
    randomDeck?: boolean
    contentCreatorOnly?: boolean
}

interface LinkMenuProps {
    links: LinkInfo[]
    genericOnClick?: () => void
    style?: React.CSSProperties,
    dropdownOnly?: boolean
    linkMenuStore: LinkMenuStore
    children?: React.ReactNode
}

export class LinkMenuStore {
    @observable
    open = false

    buttonIsHovered = false
    menuIsHovered = false

    anchorElRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()

    constructor(private name: MenuStoreName) {
        makeObservable(this)
    }

    handleOpen = () => {
        this.buttonIsHovered = true
        this.open = true
        closeAllMenuStoresExcept(this.name)
    }
    handleClose = () => {
        this.buttonIsHovered = false
        this.menuIsHovered = false
        this.open = false
    }
    autoCloseIfNotHovered = () => {
        this.buttonIsHovered = false
        this.menuIsHovered = false
        window.setTimeout(() => {
            if (!this.buttonIsHovered && !this.menuIsHovered) {
                this.handleClose()
            }
        }, 500)
    }
}

@observer
export class LinkMenu extends React.Component<LinkMenuProps> {

    render() {
        const {links, genericOnClick, style, dropdownOnly, linkMenuStore, children} = this.props
        const filteredLinks = links.filter(link => link.contentCreatorOnly == null || userStore.contentCreator)
        if (deckStore.randomDeckId) {
            return <Redirect to={Routes.deckPage(deckStore.randomDeckId)}/>
        }
        if (screenStore.smallScreenTopBar() && !dropdownOnly) {
            return (
                <>
                    {filteredLinks
                        .filter(linkInfo => linkInfo.mobileActive)
                        .map(linkInfo => {
                            if (linkInfo.randomDeck) {
                                return (
                                    <ListItem
                                        key={linkInfo.text}
                                        color={"inherit"}
                                        style={{...style}}
                                        onClick={() => {
                                            if (genericOnClick) {
                                                linkMenuStore.handleClose()
                                                genericOnClick()
                                                if (linkInfo.onClick) {
                                                    linkInfo.onClick()
                                                }
                                            }
                                        }}
                                        // eslint-disable-next-line
                                        // @ts-ignore
                                        component={linkInfo.component}
                                    >
                                        <ListItemText primary={linkInfo.text} primaryTypographyProps={{noWrap: true}}/>
                                    </ListItem>
                                )
                            }
                            return (
                                <ListItemLink
                                    key={linkInfo.text}
                                    to={linkInfo.to!}
                                    onClick={() => {
                                        if (genericOnClick) {
                                            genericOnClick()
                                        }
                                        if (linkInfo.onClick) {
                                            linkInfo.onClick()
                                        }
                                    }}
                                    primary={linkInfo.text}
                                />
                            )
                        })}
                    {children}
                </>
            )
        }

        const firstLink = filteredLinks[0]
        return (
            <div>
                <div ref={linkMenuStore.anchorElRef}>
                    <div>
                        <LinkButton
                            color={"inherit"}
                            href={firstLink.to}
                            style={{...style, marginRight: 0}}
                            onClick={() => {
                                if (genericOnClick) {
                                    genericOnClick()
                                }
                                linkMenuStore.buttonIsHovered = false
                                if (firstLink.onClick) {
                                    firstLink.onClick()
                                }
                            }}
                            onMouseEnter={linkMenuStore.handleOpen}
                            onMouseLeave={linkMenuStore.autoCloseIfNotHovered}
                        >
                            {firstLink.text}
                            <ArrowDropDown style={{marginLeft: spacing(1)}}/>
                        </LinkButton>
                    </div>
                </div>
                <MenuPopper store={linkMenuStore} links={filteredLinks} ref={linkMenuStore.anchorElRef}>
                    {children}
                </MenuPopper>
            </div>
        )
    }
}

interface MenuPopperProps {
    store: LinkMenuStore
    links: LinkInfo[]
    children?: React.ReactNode
}

// eslint-disable-next-line
const MenuPopper = observer(React.forwardRef((props: MenuPopperProps, ref: React.Ref<HTMLDivElement>) => {
    const {store, links, children} = props
    return (
        <Popper
            open={store.open}
            anchorEl={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (ref as any).current
            }
            transition
            disablePortal
        >
            {({TransitionProps, placement}) => (
                <Grow
                    {...TransitionProps}
                    style={{transformOrigin: placement === "bottom" ? "center top" : "center bottom"}}
                >
                    <div onMouseEnter={() => store.menuIsHovered = true} onMouseLeave={store.autoCloseIfNotHovered}>
                        <Paper>
                            <MenuList>
                                {links.slice(1).map(linkInfo => {
                                    if (linkInfo.to != null) {
                                        return (
                                            <LinkMenuItem
                                                key={linkInfo.text}
                                                onClick={() => {
                                                    store.handleClose()
                                                    if (linkInfo.onClick) {
                                                        linkInfo.onClick()
                                                    }
                                                }}
                                                to={linkInfo.to}
                                            >
                                                {linkInfo.text}
                                            </LinkMenuItem>
                                        )
                                    } else if (linkInfo.component) {
                                        const SpecialLink = linkInfo.component
                                        return (
                                            <SpecialLink key={linkInfo.text}/>
                                        )
                                    } else {
                                        throw Error("No to or action in linkInfo.")
                                    }
                                })}
                                {children}
                            </MenuList>
                        </Paper>
                    </div>
                </Grow>
            )}
        </Popper>
    )
}))
