import { observer } from "mobx-react"
import React from "react"
import { log, prettyJson } from "../config/Utils"
import { Deck } from "../decks/Deck"
import { DokRadar } from "../graphs/DokRadar"
import { Loader } from "../mui-restyled/Loader"
import { statsStore } from "../stats/StatsStore"

interface AercRadarProps {
    deck: Deck
}

@observer
export class AercAveragesRadar extends React.Component<AercRadarProps> {
    render() {
        const {deck} = this.props
        const stats = statsStore.stats
        if (stats == null) {
            return <Loader/>
        }
        const data = [
            {
                aerc: "Expected Aember",
                deck: deck.expectedAmber,
            },
            {
                aerc: "Creature Protection",
                deck: deck.creatureProtection,
            },
            {
                aerc: "Aember Control",
                deck: deck.amberControl,
            },
            {
                aerc: "Artifact Control",
                deck: deck.artifactControl,
            },
            {
                aerc: "Creature Control",
                deck: deck.creatureControl,
            },
            {
                aerc: "Effective Power",
                deck: deck.effectivePower / 10,
            },
            {
                aerc: "Disruption",
                deck: deck.disruption,
            },
            {
                aerc: "Efficiency",
                deck: deck.efficiency,
            },
        ]

        log.debug(`Aerc Average radar with data: ${prettyJson(data)}`)

        return (
            <DokRadar
                data={data}
                keys={["deck"]}
                indexBy={"aerc"}

                name={"Aerc Scores and Averages"}
            />
        )
    }
}
