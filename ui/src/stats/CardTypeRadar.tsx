import React from "react"
import { Utils } from "../config/Utils"
import { DeckSearchResult } from "../decks/models/DeckSearchResult"
import { DokRadar } from "../graphs/DokRadar"
import { Loader } from "../mui-restyled/Loader"
import { statsStore } from "./StatsStore"

interface CardTypeRadarProps {
    deck: DeckSearchResult
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
                deck: Utils.valueFromPercentiles(deck.actionCount ?? 0, stats.actionCountPercentiles),
            },
            {
                cardType: "Creatures",
                deck: Utils.valueFromPercentiles(deck.creatureCount ?? 0, stats.creatureCountPercentiles),
            },
            {
                cardType: "Artifacts",
                deck: Utils.valueFromPercentiles(deck.artifactCount ?? 0, stats.artifactCountPercentiles),
            },
            {
                cardType: "Upgrades",
                deck: Utils.valueFromPercentiles(deck.upgradeCount ?? 0, stats.upgradeCountPercentiles),
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
