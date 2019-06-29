import { Typography } from "@material-ui/core"
import * as React from "react"
import { cardStore } from "./CardStore"
import { KCard } from "./KCard"

export const CardsWithAerc = (props: { title: string, accessor: (card: Partial<KCard>) => number, cards?: KCard[] }) => {
    const {title, accessor, cards} = props
    const titleComponent = <Typography variant={"inherit"}>{title}</Typography>
    if (cards == null) {
        return titleComponent
    }
    const accessAerc = (card: KCard) => {
        const fullCard = cardStore.fullCardFromCardWithName(card)

        if (fullCard && fullCard.extraCardInfo) {
            return accessor(fullCard)
        }
        return 0
    }
    const filtered = cards
        .filter(card => accessAerc(card) !== 0)
    if (filtered.length === 0) {
        return titleComponent
    } else {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                {titleComponent}
                {filtered
                    .map((card, idx) => <Typography key={idx} variant={"inherit"}>{`${card.cardTitle} = ${accessAerc(card)}`}</Typography>)}
            </div>
        )
    }
}
