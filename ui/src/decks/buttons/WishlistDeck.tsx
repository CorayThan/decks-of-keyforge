import { Tooltip } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton/IconButton"
import Typography from "@material-ui/core/Typography"
import FavoriteIcon from "@material-ui/icons/Favorite"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { UserStore } from "../../user/UserStore"
import { UserDeckStore } from "../../userdeck/UserDeckStore"

interface WishlistDeckProps {
    wishlisted: boolean
    deckId: number
    deckName: string
    wishlistCount: number
}

@observer
export class WishlistDeck extends React.Component<WishlistDeckProps> {

    @observable
    wishlisted = false

    @observable
    wishlistCount = 0

    componentDidMount(): void {
        this.wishlisted = this.props.wishlisted
        this.wishlistCount = this.props.wishlistCount
    }

    render() {
        const {deckId, deckName} = this.props
        let title
        if (UserStore.instance.loggedIn()) {
            title = (this.wishlisted ? "Remove from" : "Add to") + " my favorites"
        } else {
            title = "Login to add decks to your favorites"
        }
        return (
            <div style={{display: "flex", alignItems: "center"}}>
                <Tooltip title={title}>
                    <div>
                        <IconButton
                            onClick={() => {
                                this.wishlisted = !this.wishlisted
                                this.wishlistCount += (this.wishlisted ? 1 : -1)
                                UserDeckStore.instance.wishlist(deckName, deckId, this.wishlisted)
                            }}
                            disabled={!UserStore.instance.loggedIn()}
                        >
                            {this.wishlisted ? <FavoriteIcon color={"primary"}/> : <FavoriteIcon/>}
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
