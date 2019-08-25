import { IconButton, Menu } from "@material-ui/core"
import { People } from "@material-ui/icons"
import * as React from "react"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { LinkMenuItem } from "../mui-restyled/LinkMenuItem"

export const OwnersButton = (props: { owners?: string[] }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget)
    }

    function handleClose() {
        setAnchorEl(null)
    }

    const owners = props.owners
    if (!owners || owners.length === 0) {
        return null
    }

    return (
        <div>
            <IconButton
                onClick={handleClick}
            >
                <People/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
            >
                <div/>
                {owners.map(owner => {
                    const filters = new DeckFilters()
                    filters.owner = owner
                    return (
                        <LinkMenuItem to={Routes.deckSearch(filters)} key={owner}>
                            {owner}'s decks
                        </LinkMenuItem>
                    )
                })}
            </Menu>
        </div>
    )
}
