import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { SasTip } from "../mui-restyled/SasTip"

export interface CardsMatchSasTipProps {
    title: string
    title2?: string
    matches: (card: KCard) => boolean
    matches2?: (card: KCard) => boolean
    cards: KCard[]
    children: React.ReactNode
}

@observer
export class CardsMatchSasTip extends React.Component<CardsMatchSasTipProps> {

    render() {
        const {title, title2, cards, matches, matches2, children} = this.props

        if (!cardStore.cardsLoaded) {
            return null
        }

        const matchedCards = cards
            .map(card => cardStore.fullCardFromCardName(card.cardTitle))
            .filter(card => card != null && matches(card as KCard))

        const matchedCards2 = matches2 == null ? [] : cards
            .map(card => cardStore.fullCardFromCardName(card.cardTitle))
            .filter(card => card != null && matches(card as KCard))

        const firstContent = (matchedCards.length > 0 &&
            <div>
                {matchedCards.map((card, idx) => (
                    <Typography variant={"body2"} key={idx}>
                        {card!.cardTitle}
                    </Typography>
                ))}
            </div>
        )
        const firstTitle = title2 == null ? null : title
        const secondContent = (matchedCards2.length > 0 &&
            <div>
                {matchedCards.map((card, idx) => (
                    <Typography variant={"body2"} key={idx}>
                        {card!.cardTitle}
                    </Typography>
                ))}
            </div>
        )

        return (
            <SasTip
                title={<Typography variant={"subtitle1"}>{title}{title2 == null ? "" : ` / ${title2}`}</Typography>}
                contents={(
                    <div>
                        {firstTitle}
                        {firstContent}
                        {title2}
                        {secondContent}
                    </div>
                )}
            >
                {children}
            </SasTip>
        )
    }
}