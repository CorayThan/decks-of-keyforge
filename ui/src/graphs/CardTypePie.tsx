import { ResponsivePie } from "@nivo/pie"
import * as React from "react"
import { themeStore } from "../config/MuiConfig"
import { GlobalStats } from "../stats/GlobalStats"
import { DokDeckGraphWrapper } from "./DokRadar"

export const CardTypePieGlobalAverages = (props: { stats: GlobalStats, padding?: number, style?: React.CSSProperties }) =>
    (
        <CardTypePie
            name={"Global Average"}
            padding={props.padding}
            creatures={props.stats.averageCreatures}
            actions={props.stats.averageActions}
            artifacts={props.stats.averageArtifacts}
            upgrades={props.stats.averageUpgrades}
            style={{marginTop: 0, ...props.style}}
        />
    )

export const CardTypePie = (props: {
    name?: string, creatures: number, actions: number, artifacts: number, upgrades: number, padding?: number, style?: React.CSSProperties
}) => (
    <DokDeckGraphWrapper name={props.name} style={props.style}>
        <ResponsivePie
            radialLabelsLinkHorizontalLength={0}
            radialLabelsLinkDiagonalLength={12}
            innerRadius={0.4}
            padAngle={4}
            cornerRadius={4}
            margin={{top: 32, right: 72, bottom: 32, left: 72}}
            colors={{scheme: themeStore.darkMode ? "category10" : "accent"}}
            data={[
                {
                    id: "Actions",
                    label: "Actions",
                    value: props.actions,
                },
                {
                    id: "Artifacts",
                    label: "Artifacts",
                    value: props.artifacts,
                },
                {
                    id: "Creatures",
                    label: "Creatures",
                    value: props.creatures,
                },
                {
                    id: "Upgrades",
                    label: "Upgrades",
                    value: props.upgrades,
                },
            ]}
            theme={themeStore.darkMode ? darkTheme : undefined}
        />
    </DokDeckGraphWrapper>
)

const darkTheme = {
    labels: {
        text: {
            fill: "#EEEEEE"
        }
    },
    tooltip: {
        container: {
            background: "#2d374d",
            color: "inherit",
            boxShadow: "0 3px 9px rgba(0, 0, 0, 0.5)",
        }
    }
}
