import { Dialog, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyButton } from "../mui-restyled/KeyButton"
import { screenStore } from "../ui/ScreenStore"
import { CardSimpleView } from "./CardSimpleView"
import { KCard } from "./KCard"

interface CardsForDeckProps {
    cards?: KCard[]
    deckName: string
    style?: React.CSSProperties
}

@observer
export class CardsForDeck extends React.Component<CardsForDeckProps> {

    @observable
    open = false

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
    }

    render() {
        const {cards, deckName, style} = this.props
        if (cards == null) {
            return null
        }

        let maxWidth = 1600
        if (screenStore.screenWidth < 1630) {
            maxWidth = 1288
        }

        return (
            <div style={style}>
                <KeyButton
                    color={"primary"}
                    onClick={this.handleOpen}
                >
                    Cards
                </KeyButton>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                    fullScreen={true}
                    style={{zIndex: screenStore.zindexes.cardsDisplay}}
                >
                    <DialogTitle disableTypography={true} style={{display: "flex", justifyContent: "center"}}>
                        <Typography variant={"h5"}>{deckName}</Typography>
                    </DialogTitle>
                    <DialogContent style={{display: "flex", justifyContent: "center"}}>
                        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth}}>
                            {cards.map((card, idx) => (
                                <CardSimpleView card={card} key={idx} size={250} style={{margin: 4}}/>
                            ))}
                        </div>
                    </DialogContent>
                    <DialogActions style={{display: "flex", justifyContent: "center"}}>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Close</KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
