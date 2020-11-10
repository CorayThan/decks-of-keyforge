import { ListItem } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { UserSearchResult } from "../../generated-src/UserSearchResult"

export const UserListItem = (props: { user: UserSearchResult, onClick: () => void }) => {

    const {user, onClick} = props
    const {username, deckCount, forSaleCount, allowUsersToSeeDeckOwnership} = user

    return (
        <ListItem
            onClick={onClick}
            button={true}
        >
            <Typography variant={"body2"} style={{width: 120}} noWrap={true}>
                {username}
            </Typography>
            <Typography variant={"body2"} style={{width: 160}} noWrap={true}>
                {allowUsersToSeeDeckOwnership ? `Decks: ${deckCount}` : "Private Collection"}
            </Typography>
            <Typography variant={"body2"} noWrap={true}>
                For Sale: {forSaleCount}
            </Typography>
        </ListItem>
    )
}
