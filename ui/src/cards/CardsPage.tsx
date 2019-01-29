import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { CardView } from "./CardSimpleView"
import { CardsSearchDrawer } from "./CardsSearchDrawer"
import { CardStore } from "./CardStore"

@observer
export class CardsPage extends React.Component {

    constructor(props: {}) {
        super(props)
        UiStore.instance.setTopbarValues("Cards of Keyforge", "Cards", "Search and sort")
    }

    render() {

        const {cards, searchingForCards} = CardStore.instance

        let cardsDisplay
        if (!searchingForCards && cards) {
            if (cards.length === 0) {
                cardsDisplay = (
                    <Typography variant={"h6"} color={"secondary"} style={{marginTop: spacing(4)}}>
                        Sorry, no cards match your search criteria.
                    </Typography>
                )
            } else {
                cardsDisplay = (
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        {cards.map(card => (
                            <CardView card={card} key={card.id} simple={!keyLocalStorage.showFullCardView} />
                        ))}
                    </div>
                )
            }
        }

        return (
            <div style={{display: "flex"}}>
                <CardsSearchDrawer/>
                <div
                    style={{flexGrow: 1, margin: spacing(2)}}
                >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Loader show={searchingForCards}/>
                        {cardsDisplay}
                    </div>
                </div>
            </div>
        )
    }
}