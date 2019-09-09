import React from "react"
import { Deck } from "../decks/Deck"
import { DokRadar } from "./DokRadar"

interface CardTypeRadarProps {
    deck: Deck
    style?: React.CSSProperties
}

export class CardTypeRadar extends React.Component<CardTypeRadarProps> {
    render() {
        const {deck, style} = this.props
        const data = [
            {
                cardType: "Actions",
                deck: deck.actionsPercentile,
            },
            {
                cardType: "Creatures",
                deck: deck.creaturesPercentile,
            },
            {
                cardType: "Artifacts",
                deck: deck.artifactsPercentile
            },
            {
                cardType: "Upgrades",
                deck: deck.upgradesPercentile,
            },
        ]

        return (
            <DokRadar
                data={data}
                keys={["deck"]}
                indexBy={"cardType"}
                name={"Card Type Rankings"}
                style={style}
            />
        )
    }
}
