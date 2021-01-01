import { Collapse, IconButton } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { AercRadar } from "../aerc/AercRadar"
import { rotateIconStyle } from "../components/SearchDrawerExpansionPanel"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, theme } from "../config/MuiConfig"
import { DeckSearchResult } from "../decks/models/DeckSearchResult"
import { CardTypePie, CardTypePieGlobalAverages } from "../graphs/CardTypePie"
import { ComparisonBar, ComparisonBarProps } from "../graphs/ComparisonBar"
import { Loader } from "../mui-restyled/Loader"
import { screenStore } from "../ui/ScreenStore"
import { CardTypeRadar } from "./CardTypeRadar"
import { statsStore } from "./StatsStore"
import { ToggleStats } from "./ToggleStats"

interface DeckStatsViewProps {
    deck: DeckSearchResult
}

@observer
export class DeckStatsView extends React.Component<DeckStatsViewProps> {
    render() {
        const {deck} = this.props
        const {
            creatureCount, actionCount, artifactCount, upgradeCount,
        } = deck
        const stats = statsStore.stats
        if (!stats) {
            return <Loader/>
        }

        const compact = screenStore.smallDeckView()

        const contents = (
            <>
                {!compact && (
                    <ToggleStats
                        style={{position: "fixed", right: theme.spacing(2), bottom: theme.spacing(2), zIndex: screenStore.zindexes.keyDrawer}}
                    />
                )}
                <CardTypePie
                    name={"This Deck"}
                    creatures={creatureCount ?? 0}
                    actions={actionCount ?? 0}
                    artifacts={artifactCount ?? 0}
                    upgrades={upgradeCount ?? 0}
                    style={{marginTop: spacing(2), alignSelf: "flex-start"}}
                />
                {!compact && <CardTypePieGlobalAverages stats={stats} style={{marginTop: spacing(2), alignSelf: "flex-start"}}/>}
                <AercRadar deck={deck}  style={{alignSelf: "flex-start"}}/>
                {!compact && <CardTypeRadar deck={deck} style={{alignSelf: "flex-start"}}/>}
            </>
        )

        if (compact) {
            return contents
        }

        return (
            <div style={{display: "flex", flexWrap: "wrap", maxWidth: 900}}>
                {contents}
            </div>
        )
    }
}

@observer
export class ExtraDeckStatsView extends React.Component<DeckStatsViewProps> {

    render() {
        const {
            sasRating, synergyRating, antisynergyRating,
            aercScore, amberControl, expectedAmber, artifactControl, creatureControl,
            efficiency, recursion, effectivePower, disruption, creatureProtection
        } = this.props.deck
        const stats = statsStore.stats
        if (!stats) {
            return <Loader/>
        }
        const effectiveCreaturePowerCompareValue = Math.floor(effectivePower / 5) * 5

        const rowSize = screenStore.screenWidth / 332

        const barProps: ComparisonBarProps[] = [
            {name: "SAS", data: stats.sas, comparison: sasRating},
            {name: "Synergy", data: stats.synergy, comparison: synergyRating},
            {name: "Antisynergy", data: stats.antisynergy, comparison: antisynergyRating},
            {name: "Raw AERC", data: stats.aerc, comparison: Math.round(aercScore)},
            {name: "Aember Control", data: stats.amberControl, comparison: Math.round(amberControl)},
            {name: "Expected Aember", data: stats.expectedAmber, comparison: Math.round(expectedAmber)},
            {name: "Creature Protection", data: stats.creatureProtection, comparison: Math.round(creatureProtection ?? 0)},
            {name: "Artifact Control", data: stats.artifactControl, comparison: Math.round(artifactControl ?? 0)},
            {name: "Creature Control", data: stats.creatureControl, comparison: Math.round(creatureControl)},
            {name: "Effective Power", data: stats.effectivePower, comparison: effectiveCreaturePowerCompareValue},
            {name: "Efficiency", data: stats.efficiency, comparison: Math.round(efficiency ?? 0)},
            {name: "Recursion", data: stats.recursion, comparison: Math.round(recursion ?? 0)},
            {name: "Disruption", data: stats.disruption, comparison: Math.round(disruption ?? 0)},
        ]

        const firstRowProps = barProps.slice(0, rowSize)
        const restProps = barProps.slice(rowSize, barProps.length)

        return (
            <div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {firstRowProps.map(props => <ComparisonBar key={props.name} {...props} style={{paddingBottom: 0}}/>)}
                </div>
                <Collapse in={keyLocalStorage.displayExtraDeckStats}>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        {restProps.map(props => <ComparisonBar key={props.name} {...props} style={{paddingBottom: 0}}/>)}
                    </div>
                </Collapse>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <IconButton onClick={keyLocalStorage.toggleDisplayExtraDeckStats}>
                        <ExpandMore style={rotateIconStyle(keyLocalStorage.displayExtraDeckStats)}/>
                    </IconButton>
                </div>
            </div>
        )
    }
}
