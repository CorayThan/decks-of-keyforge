import { Tooltip } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton/IconButton"
import Typography from "@material-ui/core/Typography"
import FavoriteIcon from "@material-ui/icons/Favorite"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { userDeckStore } from "../../userdeck/UserDeckStore"

interface WishlistDeckProps {
    deckId: number
    deckName: string
    wishlistCount: number
}

@observer
export class WishlistDeck extends React.Component<WishlistDeckProps> {

    @observable
    wishlistCount = 0

    componentDidMount(): void {
        this.wishlistCount = this.props.wishlistCount
    }

    render() {
        const {deckId, deckName} = this.props
        let title
        let wishlisted = false

        if (userDeckStore.userDecksLoaded()) {
            const deck = userDeckStore.userDeckByDeckId(deckId)
            wishlisted = deck == null ? false : deck.wishlist
            title = (wishlisted ? "Remove from" : "Add to") + " my favorites"
        } else {
            title = "Login to add decks to your favorites"
        }
        return (
            <div style={{display: "flex", alignItems: "center"}}>
                <Tooltip title={title}>
                    <div>
                        <IconButton
                            onClick={() => {
                                wishlisted = !wishlisted
                                this.wishlistCount += (wishlisted ? 1 : -1)
                                userDeckStore.wishlist(deckName, deckId, wishlisted)
                            }}
                            disabled={!userDeckStore.userDecksLoaded()}
                        >
                            {wishlisted ? <FavoriteIcon color={"primary"}/> : <FavoriteIcon/>}
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title={"Times favorited"}>
                    <Typography variant={"body1"}>{this.wishlistCount}</Typography>
                </Tooltip>
            </div>
        )
    }
}
