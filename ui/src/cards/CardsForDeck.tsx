import { Dialog, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import MenuItem from "@material-ui/core/MenuItem"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { HouseAndCards } from "../generated-src/HouseAndCards"
import { KeyButton } from "../mui-restyled/KeyButton"
import { screenStore } from "../ui/ScreenStore"
import { CardSimpleView } from "./views/CardSimpleView"

interface CardsForDeckProps {
    cards: HouseAndCards[]
    deckName: string
    onClick: () => void
}

@observer
export class CardsForDeck extends React.Component<CardsForDeckProps> {
    @observable
    open = false

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
        this.props.onClick()
    }

    constructor(props: CardsForDeckProps) {
        super(props)
        makeObservable(this)
    }

    render() {
        const {cards, deckName} = this.props

        let maxWidth = 1600
        if (screenStore.screenWidth < 1630) {
            maxWidth = 1288
        } else if (screenStore.screenWidth > 3160) {
            maxWidth = 3160
        }

        return (
            <>
                <MenuItem
                    onClick={this.handleOpen}
                >
                    Cards
                </MenuItem>
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
                        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignContent: "center", maxWidth}}>
                            {cards
                                .flatMap(houseAndCards => houseAndCards.cards)
                                .map((card, idx) => (
                                    <CardSimpleView card={card} key={idx} size={250} style={{margin: 4}}/>
                                ))}
                        </div>
                    </DialogContent>
                    <DialogActions style={{display: "flex", justifyContent: "center"}}>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Close</KeyButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}
