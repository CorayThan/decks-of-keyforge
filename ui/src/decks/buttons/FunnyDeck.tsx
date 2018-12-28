import { Tooltip } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton/IconButton"
import Typography from "@material-ui/core/Typography"
import TagFacesIcon from "@material-ui/icons/TagFaces"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { UserStore } from "../../user/UserStore"
import { UserDeckStore } from "../../userdeck/UserDeckStore"

interface FunnyDeckProps {
    funny: boolean
    funnyCount: number
    deckId: number
    deckName: string
}

@observer
export class FunnyDeck extends React.Component<FunnyDeckProps> {

    @observable
    funny = false

    @observable
    funnyCount = 0

    componentDidMount(): void {
        this.funny = this.props.funny
        this.funnyCount = this.props.funnyCount
    }

    render() {
        const {deckId, deckName} = this.props
        let title
        if (UserStore.instance.loggedIn()) {
            title = (this.funny ? "Remove as" : "Mark as") + " a funny deck"
        } else {
            title = "Login to mark decks as funny"
        }
        return (
            <div style={{display: "flex", alignItems: "center"}}>
                <Tooltip title={title}>
                    <div>
                        <IconButton
                            onClick={() => {
                                this.funny = !this.funny
                                this.funnyCount += (this.funny ? 1 : -1)
                                UserDeckStore.instance.funny(deckName, deckId, this.funny)
                            }}
                            disabled={!UserStore.instance.loggedIn()}
                        >
                            {this.funny ? <TagFacesIcon color={"primary"}/> : <TagFacesIcon/>}
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
