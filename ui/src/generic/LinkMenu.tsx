import { Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core"
import { MenuItemProps } from "@material-ui/core/MenuItem"
import { ArrowDropDown } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { LinkButton } from "../mui-restyled/LinkButton"
import { LinkMenuItem } from "../mui-restyled/LinkMenuItem"
import { screenStore } from "../ui/ScreenStore"

export interface LinkInfo {
    to?: string
    component?: React.ReactType<MenuItemProps>
    text: string
    mobileActive?: boolean
}

interface LinkMenuProps {
    links: LinkInfo[]
    genericOnClick?: () => void
    style?: React.CSSProperties
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
        const {links, genericOnClick, style} = this.props
        if (screenStore.screenSizeMd()) {
            return (
                <>
                    {links
                        .filter(linkInfo => linkInfo.mobileActive)
                        .map(linkInfo => {
                            if (linkInfo.to == null) {
                                return (
                                    <MenuItem
                                        key={linkInfo.text}
                                        color={"inherit"}
                                        style={{display: "flex", justifyContent: "center", ...style}}
                                        onClick={() => {
                                            if (genericOnClick) {
                                                genericOnClick()
                                            }
                                        }}
                                        component={linkInfo.component}
                                    >
                                        {linkInfo.text.toUpperCase()}
                                    </MenuItem>
                                )
                            }
                            return (
                                <LinkButton
                                    key={linkInfo.text}
                                    color={"inherit"}
                                    to={linkInfo.to}
                                    style={style}
                                    onClick={() => {
                                        if (genericOnClick) {
                                            genericOnClick()
                                        }
                                    }}
                                >
                                    {linkInfo.text}
                                </LinkButton>
                            )
                        })}
                </>
            )
        }

        const firstLink = links[0]
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
                <MenuPopper store={this.store} links={links} ref={this.store.anchorElRef}/>
            </div>
        )
    }
}

const MenuPopper = observer(React.forwardRef((props: { store: LinkMenuStore, links: LinkInfo[] }, ref: React.Ref<HTMLDivElement>) => {
    const {store, links} = props
    return (
        <Popper open={store.open} anchorEl={(ref as any).current} transition disablePortal>
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
                            </MenuList>
                        </Paper>
                    </div>
                </Grow>
            )}
        </Popper>
    )
}))
