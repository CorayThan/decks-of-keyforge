import React from "react"
import { Utils } from "../config/Utils"
import { Deck } from "../decks/Deck"
import { DokRadar } from "../graphs/DokRadar"
import { Loader } from "../mui-restyled/Loader"
import { statsStore } from "./StatsStore"

interface CardTypeRadarProps {
    deck: Deck
    style?: React.CSSProperties
}

export class CardTypeRadar extends React.Component<CardTypeRadarProps> {
    render() {
        const {deck, style} = this.props
        const stats = statsStore.stats
        if (stats == null) {
            return <Loader/>
        }
        const data = [
            {
                cardType: "Actions",
                deck: Utils.valueFromPercentiles(deck.actionCount, stats.actionCountPercentiles),
            },
            {
                cardType: "Creatures",
                deck: Utils.valueFromPercentiles(deck.creatureCount, stats.creatureCountPercentiles),
            },
            {
                cardType: "Artifacts",
                deck: Utils.valueFromPercentiles(deck.artifactCount, stats.artifactCountPercentiles),
            },
            {
                cardType: "Upgrades",
                deck: Utils.valueFromPercentiles(deck.upgradeCount, stats.upgradeCountPercentiles),
            },
        ]

        return (
            <DokRadar
                data={data}
                keys={["deck"]}
                indexBy={"cardType"}
                name={"Card Type Rankings"}
                style={style}
                maxValue={100}
            />
        )
    }
}
