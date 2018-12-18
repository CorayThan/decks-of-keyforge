import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { log, prettyJson } from "../config/Utils"
import { KeyTopbar } from "../layout-parts/KeyTopbar"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { CardSimpleView } from "./CardSimpleView"
import { CardsSearchDrawer } from "./CardsSearchDrawer"
import { CardStore } from "./CardStore"

@observer
export class CardsPage extends React.Component {

    render() {

        const cards = CardStore.instance.cards
        log.debug(`Cards in cards page ${prettyJson(cards)}`)

        let cardsDisplay
        if (cards.length === 0) {
            cardsDisplay = (
                <Typography>Search up some cards!</Typography>
            )
        } else {
            cardsDisplay = (
                <div>
                    {cards.map(card => (
                        <CardSimpleView card={card} key={card.id}/>
                    ))}
                </div>
            )
        }

        return (
            <div style={{display: "flex"}}>
                <KeyTopbar name={"Cards"}/>
                <CardsSearchDrawer/>
                <div
                    style={{flexGrow: 1, padding: spacing(4)}}
                >
                    <ToolbarSpacer/>

                    {cardsDisplay}

                </div>
            </div>
        )
    }
}