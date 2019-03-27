import { Tooltip } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton/IconButton"
import Typography from "@material-ui/core/Typography"
import TagFacesIcon from "@material-ui/icons/TagFaces"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { userDeckStore } from "../../userdeck/UserDeckStore"

interface FunnyDeckProps {
    funnyCount: number
    deckId: number
    deckName: string
}

@observer
export class FunnyDeck extends React.Component<FunnyDeckProps> {

    @observable
    funnyCount = 0

    componentDidMount(): void {
        this.funnyCount = this.props.funnyCount
    }

    render() {
        const {deckId, deckName} = this.props
        let title
        let funny = false
        if (userDeckStore.userDecksLoaded()) {
            const deck = userDeckStore.userDeckByDeckId(deckId)
            funny = deck == null ? false : deck.funny
            title = (funny ? "Remove as" : "Mark as") + " a funny deck"
        } else {
            title = "Login to mark decks as funny"
        }
        return (
            <div style={{display: "flex", alignItems: "center"}}>
                <Tooltip title={title}>
                    <div>
                        <IconButton
                            onClick={() => {
                                funny = !funny
                                this.funnyCount += (funny ? 1 : -1)
                                userDeckStore.funny(deckName, deckId, funny)
                            }}
                            disabled={!userDeckStore.userDecksLoaded()}
                        >
                            {funny ? <TagFacesIcon color={"primary"}/> : <TagFacesIcon/>}
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title={"Times marked funny"}>
                    <Typography variant={"body1"}>{this.funnyCount}</Typography>
                </Tooltip>
            </div>
        )
    }
}
