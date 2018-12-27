import IconButton from "@material-ui/core/IconButton/IconButton"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import * as React from "react"

interface FavoriteDeckProps {
    favorited: boolean
    deckId: number
}

export class FavoriteDeck extends React.Component<FavoriteDeckProps> {
    render() {
        const {favorited, deckId} = this.props

        return (
            <IconButton>
                {favorited ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
            </IconButton>
        )
    }
}