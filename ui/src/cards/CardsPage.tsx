import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { log, prettyJson } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { CardSimpleView } from "./CardSimpleView"
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
        log.debug(`Cards in cards page ${prettyJson(cards)}`)

        let cardsDisplay
        if (cards) {
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
                            <CardSimpleView card={card} key={card.id}/>
                        ))}
                    </div>
                )
            }
        }

        return (
            <div style={{display: "flex"}}>
                <CardsSearchDrawer/>
                <div
                    style={{flexGrow: 1, padding: spacing(4)}}
                >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Loader show={searchingForCards && !cards}/>
                        {cardsDisplay}
                    </div>
                </div>
            </div>
        )
    }
}