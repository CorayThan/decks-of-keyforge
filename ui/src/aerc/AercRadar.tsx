import { observer } from "mobx-react"
import React from "react"
import { Utils } from "../config/Utils"
import { Deck } from "../decks/Deck"
import { DokRadar } from "../graphs/DokRadar"
import { Loader } from "../mui-restyled/Loader"
import { statsStore } from "../stats/StatsStore"

interface AercRadarProps {
    deck: Deck
}

@observer
export class AercRadar extends React.Component<AercRadarProps> {
    render() {
        const {deck} = this.props
        const stats = statsStore.stats
        if (stats == null) {
            return <Loader/>
        }
        const data = [
            {
                aerc: "Expected Aember (E)",
                deck: Utils.valueFromPercentiles(deck.expectedAmber, stats.expectedAmberPercentiles),
            },
            {
                aerc: "Aember Protection",
                deck: Utils.valueFromPercentiles(deck.amberProtection, stats.amberProtectionPercentiles),
            },
            {
                aerc: "Aember Ctrl (A)",
                deck: Utils.valueFromPercentiles(deck.amberControl, stats.amberControlPercentiles),
            },
            {
                aerc: "Artifact Control (R)",
                deck: Utils.valueFromPercentiles(deck.artifactControl, stats.artifactControlPercentiles),
            },
            {
                aerc: "Creature Control (C)",
                deck: Utils.valueFromPercentiles(deck.creatureControl, stats.creatureControlPercentiles),
            },
            {
                aerc: "Effective Power (P)",
                deck: Utils.valueFromPercentiles(deck.effectivePower, stats.effectivePowerPercentiles),
            },
            {
                aerc: "Disruption (D)",
                deck: Utils.valueFromPercentiles(deck.disruption, stats.disruptionPercentiles),
            },
            {
                aerc: "Efficiency (E)",
                deck: Utils.valueFromPercentiles(deck.efficiency, stats.efficiencyPercentiles),
            },
        ]

        return (
            <DokRadar
                data={data}
                keys={["deck"]}
                indexBy={"aerc"}
                name={"Aerc Percentile Rankings"}
                maxValue={100}
            />
        )
    }
}
