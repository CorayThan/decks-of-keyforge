import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { cardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { SasTip } from "../mui-restyled/SasTip"
import { FrontendCard } from "../generated-src/FrontendCard"

export interface CardsMatchSasTipProps {
    title: string
    subtitle1?: string
    subtitle2?: string
    subtitle3?: string
    matches: (card: FrontendCard) => boolean
    matches2?: (card: FrontendCard) => boolean
    cards: FrontendCard[]
    customMatches?: string[]
    children: React.ReactNode
}

@observer
export class CardsMatchSasTip extends React.Component<CardsMatchSasTipProps> {

    render() {
        const {title, subtitle1, subtitle2, cards, matches, matches2, subtitle3, customMatches, children} = this.props

        if (!cardStore.cardsLoaded) {
            return null
        }

        const matchedCards = cards
            .filter(card => card != null && matches(card as FrontendCard))

        const matchedCards2 = matches2 == null ? [] : cards
            .filter(card => card != null && matches2(card as FrontendCard))

        return (
            <SasTip
                title={<Typography variant={"subtitle1"}>{title}</Typography>}
                contents={(
                    <div>
                        {subtitle1 != null && matchedCards.length > 0 && (
                            <Typography variant={"overline"} style={{fontWeight: 575}}>
                                {subtitle1}
                            </Typography>
                        )}
                        {matchedCards.length > 0 &&
                            <div>
                                {matchedCards.map((card, idx) => (
                                    <Typography variant={"body2"} key={idx}>
                                        {card!.cardTitle}
                                    </Typography>
                                ))}
                            </div>}
                        {matchedCards2.length > 0 && (
                            <>
                                <Typography variant={"overline"} style={{marginTop: spacing(2)}}>
                                    {subtitle2}
                                </Typography>
                                {matchedCards2.map((card, idx) => (
                                    <Typography variant={"body2"} key={idx}>
                                        {card!.cardTitle}
                                    </Typography>
                                ))}
                            </>
                        )}
                        {customMatches != null && customMatches.length > 0 && (
                            <>
                                <Typography variant={"overline"} style={{marginTop: spacing(2)}}>
                                    {subtitle3}
                                </Typography>
                                {customMatches.map((card, idx) => (
                                    <Typography variant={"body2"} key={idx}>
                                        {card}
                                    </Typography>
                                ))}
                            </>
                        )}
                    </div>
                )}
            >
                {children}
            </SasTip>
        )
    }
}