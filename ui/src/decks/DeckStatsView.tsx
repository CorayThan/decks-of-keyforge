import { Typography } from "@material-ui/core"
import * as React from "react"
import { VictoryPie } from "victory"
import { spacing } from "../config/MuiConfig"
import { Deck } from "./Deck"

interface DeckStatsViewProps {
    deck: Deck
}

const pieColors = ["DodgerBlue", "SandyBrown", "SlateBlue", "MediumTurquoise"]

export class DeckStatsView extends React.Component<DeckStatsViewProps> {
    render() {
        const {name, totalCreatures, totalActions, totalArtifacts, totalUpgrades} = this.props.deck

        return (
            <div style={{display: "flex", margin: spacing(2)}}>
                <KeyPie name={name} creatures={totalCreatures} actions={totalActions} artifacts={totalArtifacts} upgrades={totalUpgrades}/>
                <KeyPie name={"Global Average"} creatures={17} actions={14} artifacts={4} upgrades={1}/>
            </div>
        )
    }
}

const KeyPie = (props: { name: string, creatures: number, actions: number, artifacts: number, upgrades: number }) => (
    <div>
        <Typography variant={"h6"}>{props.name}</Typography>
        <VictoryPie
            data={[
                {x: `Actions – ${props.actions}`, y: props.actions},
                {x: `Artifacts – ${props.artifacts}`, y: props.artifacts},
                {x: `Creatures – ${props.creatures}`, y: props.creatures},
                {x: `Upgrades – ${props.upgrades}`, y: props.upgrades},
            ]}
            colorScale={pieColors}
            height={240}
        />
    </div>
)
