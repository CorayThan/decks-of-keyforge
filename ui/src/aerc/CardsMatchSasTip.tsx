import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { SasTip } from "../mui-restyled/SasTip"

export interface CardsMatchSasTipProps {
    title: string
    matches: (card: KCard) => boolean
    cards: KCard[]
    children: React.ReactNode
}

@observer
export class CardsMatchSasTip extends React.Component<CardsMatchSasTipProps> {

    render() {
        const {title, cards, matches, children} = this.props
        const matchedCards = cards
            .map(card => cardStore.fullCardFromCardWithName(card))
            .filter(card => card != null && matches(card as KCard))

        return (
            <SasTip
                title={<Typography variant={"subtitle1"}>{title}</Typography>}
                contents={(matchedCards.length > 0 &&
                    <div>
                        {matchedCards.map((card, idx) => (
                            <Typography variant={"body2"} key={idx}>
                                {card!.cardTitle}
                            </Typography>
                        ))}
                    </div>
                )}
            >
                {children}
            </SasTip>
        )
    }
}