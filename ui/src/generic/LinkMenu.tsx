import { Grow, ListItem, ListItemText, MenuList, Paper, Popper } from "@material-ui/core"
import { MenuItemProps } from "@material-ui/core/MenuItem"
import { ArrowDropDown } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
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
    children?: React.ReactNode
}

class LinkMenuStore {
    @observable
    open = false

    buttonIsHovered = false
    menuIsHovered = false

    anchorElRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()

    handleOpen = () => {
        this.buttonIsHovered = true
        this.open = true
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

    store = new LinkMenuStore()

    render() {
        const {links, genericOnClick, style, dropdownOnly, children} = this.props
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
                                                this.store.handleClose()
                                                genericOnClick()
                                            }
                                        }}
                                        // eslint-disable-next-line
                                        // @ts-ignore
                                        component={linkInfo.component}
                                    >
                                        <ListItemText primary={linkInfo.text}/>
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
                <div ref={this.store.anchorElRef}>
                    <div>
                        <LinkButton
                            color={"inherit"}
                            to={firstLink.to}
                            style={{...style, marginRight: 0}}
                            onClick={() => {
                                if (genericOnClick) {
                                    genericOnClick()
                                }
                                this.store.buttonIsHovered = false
                            }}
                            onMouseEnter={this.store.handleOpen}
                            onMouseLeave={this.store.autoCloseIfNotHovered}
                        >
                            {firstLink.text}
                            <ArrowDropDown style={{marginLeft: spacing(1)}}/>
                        </LinkButton>
                    </div>
                </div>
                <MenuPopper store={this.store} links={filteredLinks} ref={this.store.anchorElRef}>
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
                                                onClick={store.handleClose}
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
