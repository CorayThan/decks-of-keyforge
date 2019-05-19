import { Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core"
import { MenuItemProps } from "@material-ui/core/MenuItem"
import { ArrowDropDown } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
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

@observer
export class LinkMenu extends React.Component<LinkMenuProps> {

    @observable
    open = false

    buttonIsHovered = false
    menuIsHovered = false

    anchorEl?: HTMLDivElement | null
    menuEl?: HTMLDivElement | null

    handleOpen = () => {
        log.debug("Handle open")
        this.buttonIsHovered = true
        this.open = true
    }
    handleClose = () => {
        this.buttonIsHovered = false
        this.menuIsHovered = false
        this.open = false
    }
    autoCloseIfNotHovered = () => {
        log.debug("auto close")
        this.buttonIsHovered = false
        this.menuIsHovered = false
        window.setTimeout(() => {
            if (!this.buttonIsHovered && !this.menuIsHovered) {
                this.handleClose()
            }
        }, 500)
    }

    render() {
        const {links, genericOnClick, style} = this.props
        if (screenStore.screenSizeMd()) {
            return (
                <>
                    {links
                        .filter(linkInfo => linkInfo.mobileActive)
                        .map(linkInfo => (
                            <>
                                {linkInfo.to == null ? (
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
                                        {linkInfo.text}
                                    </MenuItem>
                                ) : (
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
                                )}
                            </>
                        ))}
                </>
            )
        }

        const firstLink = links[0]
        return (
            <div>
                <div ref={node => this.anchorEl = node}>
                    <LinkButton
                        color={"inherit"}
                        to={firstLink.to}
                        style={{...style, marginRight: 0}}
                        onClick={() => {
                            if (genericOnClick) {
                                genericOnClick()
                            }
                            this.buttonIsHovered = false
                        }}
                        onMouseEnter={this.handleOpen}
                        onMouseLeave={this.autoCloseIfNotHovered}
                    >
                        {firstLink.text}
                        <ArrowDropDown style={{marginLeft: spacing(1)}}/>
                    </LinkButton>
                </div>
                <Popper open={this.open} anchorEl={this.anchorEl} transition disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{transformOrigin: placement === "bottom" ? "center top" : "center bottom"}}
                        >
                            <div ref={node => this.menuEl = node} onMouseEnter={() => this.menuIsHovered = true} onMouseLeave={this.autoCloseIfNotHovered}>
                                <Paper>
                                    <MenuList>
                                        {links.slice(1).map(linkInfo => {
                                            if (linkInfo.to != null) {
                                                return (
                                                    <LinkMenuItem key={linkInfo.text} onClick={this.handleClose} to={linkInfo.to}>{linkInfo.text}</LinkMenuItem>
                                                )
                                            } else if (linkInfo.component) {
                                                return (
                                                    <MenuItem
                                                        key={linkInfo.text}
                                                        onClick={() => {
                                                            this.handleClose()
                                                        }}
                                                        component={linkInfo.component}
                                                    >
                                                        {linkInfo.text}
                                                    </MenuItem>
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
            </div>
        )
    }
}
