import { Collapse, IconButton } from "@material-ui/core"
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { AercRadar } from "../aerc/AercRadar"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { theme } from "../config/MuiConfig"
import { Deck } from "../decks/Deck"
import { CardTypePie, CardTypePieGlobalAverages } from "../graphs/CardTypePie"
import { ComparisonBar, ComparisonBarProps } from "../graphs/ComparisonBar"
import { Loader } from "../mui-restyled/Loader"
import { screenStore } from "../ui/ScreenStore"
import { CardTypeRadar } from "./CardTypeRadar"
import { statsStore } from "./StatsStore"
import { ToggleStats } from "./ToggleStats"

interface DeckStatsViewProps {
    deck: Deck
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
                    creatures={creatureCount}
                    actions={actionCount}
                    artifacts={artifactCount}
                    upgrades={upgradeCount}
                    style={{marginTop: 0}}
                />
                {!compact && <CardTypePieGlobalAverages stats={stats}/>}
                <AercRadar deck={deck}/>
                <CardTypeRadar deck={deck}/>
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
            sasRating, cardsRating, synergyRating, antisynergyRating, totalPower,
            aercScore, amberControl, expectedAmber, artifactControl, creatureControl,
            efficiency, effectivePower, disruption, houseCheating, amberProtection
        } = this.props.deck
        const stats = statsStore.stats
        if (!stats) {
            return <Loader/>
        }
        const creaturePowerCompareValue = Math.floor(totalPower / 5) * 5
        const effectiveCreaturePowerCompareValue = Math.floor(effectivePower / 5) * 5

        const rowSize = screenStore.screenWidth / 332

        const barProps: ComparisonBarProps[] = [
            {name: "SAS", data: stats.sas, comparison: sasRating},
            {name: "Cards Rating", data: stats.cardsRating, comparison: cardsRating},
            {name: "Synergy", data: stats.synergy, comparison: synergyRating},
            {name: "Antisynergy", data: stats.antisynergy, comparison: antisynergyRating},
            {name: "Creature Power", data: stats.totalCreaturePower, comparison: creaturePowerCompareValue},
            {name: "AERC", data: stats.aerc, comparison: Math.round(aercScore)},
            {name: "Aember Control", data: stats.amberControl, comparison: Math.round(amberControl)},
            {name: "Expected Aember", data: stats.expectedAmber, comparison: Math.round(expectedAmber)},
            {name: "Aember Protection", data: stats.amberProtection, comparison: Math.round(amberProtection)},
            {name: "Artifact Control", data: stats.artifactControl, comparison: Math.round(artifactControl)},
            {name: "Creature Control", data: stats.creatureControl, comparison: Math.round(creatureControl)},
            {name: "Effective Power", data: stats.effectivePower, comparison: effectiveCreaturePowerCompareValue},
            {name: "Efficiency", data: stats.efficiency, comparison: Math.round(efficiency)},
            {name: "Disruption", data: stats.disruption, comparison: Math.round(disruption)},
            {name: "House Cheating", data: stats.houseCheating, comparison: Math.round(houseCheating)},
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
                        {keyLocalStorage.displayExtraDeckStats ? <ExpandLess/> : <ExpandMore/>}
                    </IconButton>
                </div>
            </div>
        )
    }
}
