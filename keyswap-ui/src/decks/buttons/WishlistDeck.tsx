import { Tooltip } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton/IconButton"
import FavoriteIcon from "@material-ui/icons/Favorite"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { log } from "../../config/Utils"
import { UserDeckStore } from "../../userdeck/UserDeckStore"

interface WishlistDeckProps {
    wishlisted: boolean
    deckId: number
    deckName: string
}

@observer
export class WishlistDeck extends React.Component<WishlistDeckProps> {

    @observable
    wishlisted = false

    componentDidMount(): void {
        this.wishlisted = this.props.wishlisted
    }

    render() {
        const {wishlisted, deckId} = this.props
        log.debug(`Wishlisted: ${wishlisted}`)
        return (
            <Tooltip title={"Add to my wishlist"}>
                <IconButton
                    onClick={() => {
                        this.wishlisted = !wishlisted
                        UserDeckStore.instance.wishlist("", deckId, wishlisted)
                    }}
                >
                    {this.wishlisted ? <FavoriteIcon/> : <FavoriteIcon color={"primary"}/>}
                </IconButton>
            </Tooltip>
        )
    }
}
