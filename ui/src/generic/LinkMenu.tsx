import { ClickAwayListener, Grow, MenuList, Paper, Popper } from "@material-ui/core"
import { ArrowDropDown } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { LinkButton } from "../mui-restyled/LinkButton"
import { LinkMenuItem } from "../mui-restyled/LinkMenuItem"
import { screenStore } from "../ui/ScreenStore"

interface LinkInfo {
    to: string
    text: string
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

    @observable
    closeUntilMouseOut = false

    anchorEl?: HTMLDivElement | null

    handleOpen = () => this.open = true
    handleClose = () => this.open = false

    render() {
        const {links, genericOnClick, style} = this.props
        if (screenStore.screenSizeMd()) {
            return (
                <LinkButton
                    color={"inherit"}
                    to={links[0].to}
                    style={style}
                    onClick={genericOnClick}
                >
                    {links[0].text}
                </LinkButton>
            )
        }

        return (
            <div>
                <div ref={node => this.anchorEl = node}>
                    <LinkButton
                        color={"inherit"}
                        to={links[0].to}
                        style={style}
                        onClick={() => {
                            if (genericOnClick) {
                                genericOnClick()
                            }
                            this.closeUntilMouseOut = true
                            this.handleClose()
                        }}
                        onMouseOver={this.handleOpen}
                        onMouseOut={() => this.closeUntilMouseOut = false}
                    >
                        {links[0].text}
                        <ArrowDropDown style={{marginLeft: spacing(1)}}/>
                    </LinkButton>
                </div>
                <Popper open={this.open && !this.closeUntilMouseOut} anchorEl={this.anchorEl} transition disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{transformOrigin: placement === "bottom" ? "center top" : "center bottom"}}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {links.slice(1).map(linkInfo => (
                                            <LinkMenuItem key={linkInfo.text} onClick={this.handleClose} to={linkInfo.to}>{linkInfo.text}</LinkMenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        )
    }
}
