import React from "react"
import { Deck } from "../decks/Deck"
import { DokRadar } from "../stats/DokRadar"

interface AercRadarProps {
    deck: Deck
}

export class AercRadar extends React.Component<AercRadarProps> {
    render() {
        const {deck} = this.props
        const data = [
            {
                aerc: "Expected Aember",
                deck: deck.expectedAmberPercentile,
            },
            {
                aerc: "Steal Prevention",
                deck: deck.stealPreventionPercentile,
            },
            {
                aerc: "Aember Control",
                deck: deck.amberControlPercentile
            },
            {
                aerc: "Artifact Control",
                deck: deck.artifactControlPercentile,
            },
            {
                aerc: "Creature Control",
                deck: deck.creatureControlPercentile,
            },
            {
                aerc: "Effective Power",
                deck: deck.effectivePowerPercentile,
            },
            {
                aerc: "Disruption",
                deck: deck.disruptionPercentile,
            },
            {
                aerc: "Efficiency",
                deck: deck.efficiencyPercentile,
            },
        ]

        return (
            <DokRadar
                data={data}
                keys={["deck"]}
                indexBy={"aerc"}
                name={"Aerc Percentile Rankings"}
            />
        )
    }
}
