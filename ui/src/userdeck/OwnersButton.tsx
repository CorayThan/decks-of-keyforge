import { Grow, IconButton, MenuList, Paper, Popper } from "@material-ui/core"
import { People } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { LinkMenuItem } from "../mui-restyled/LinkMenuItem"

@observer
export class OwnersButton extends React.Component<{ owners?: string[] }> {

    @observable
    open = false

    buttonIsHovered = false
    menuIsHovered = false

    anchorEl?: HTMLDivElement | null
    menuEl?: HTMLDivElement | null

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

    render() {

        const owners = this.props.owners
        if (!owners || owners.length === 0) {
            return null
        }

        return (
            <div>
                <div ref={node => this.anchorEl = node}>
                    <IconButton
                        onMouseEnter={this.handleOpen}
                        onMouseLeave={this.autoCloseIfNotHovered}
                    >
                        <People/>
                    </IconButton>
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
                                        {owners.map(owner => {
                                            const filters = new DeckFilters()
                                            filters.owner = owner
                                            return (
                                                <LinkMenuItem to={Routes.deckSearch(filters)} key={owner}>
                                                    {owner}'s decks
                                                </LinkMenuItem>
                                            )
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
