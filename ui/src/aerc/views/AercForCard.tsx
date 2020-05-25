import { Typography } from "@material-ui/core"
import * as React from "react"
import { CardType } from "../../cards/CardType"
import { hasAercFromCard, KCard } from "../../cards/KCard"
import { spacing, theme } from "../../config/MuiConfig"
import { roundToHundreds, roundToTens } from "../../config/Utils"
import { SynergyCombo } from "../../synergy/DeckSynergyInfo"

export const AercForCard = (props: { card: KCard, short?: boolean, realValue?: SynergyCombo }) => {
    const {card, short, realValue} = props
    const hasAerc = hasAercFromCard(card)
    return (
        <div style={{display: "grid", gridTemplateColumns: "6fr 4fr 2fr"}}>
            <AercScore
                score={hasAerc.amberControl}
                max={hasAerc.amberControlMax}
                synergizedScore={realValue && realValue.amberControl}
                name={short ? "A" : "Aember Control (A)"}
            />
            <AercScore
                score={hasAerc.expectedAmber} max={hasAerc.expectedAmberMax} synergizedScore={realValue && realValue.expectedAmber}
                name={short ? "E" : "Expected Aember (E)"}
            />
            <AercScore
                score={hasAerc.artifactControl} max={hasAerc.artifactControlMax} synergizedScore={realValue && realValue.artifactControl}
                name={short ? "R" : "Artifact Control (R)"}
            />
            <AercScore
                score={hasAerc.creatureControl} max={hasAerc.creatureControlMax} synergizedScore={realValue && realValue.creatureControl}
                name={short ? "C" : "Creature Control (C)"}
            />
            <AercScore
                score={roundToTens(hasAerc.effectivePower / 10)}
                max={hasAerc.effectivePowerMax != null ? roundToTens(hasAerc.effectivePowerMax / 10) : undefined}
                synergizedScore={realValue && roundToTens(realValue.effectivePower / 10)}
                name={short ? "P" : "Effective Power (P)"}
            />
            {card.cardType === CardType.Creature && (
                <AercScore
                    score={0.4}
                    singleColumn={realValue != null}
                    name={short ? "CB" : "Creature Bonus"}
                />
            )}
            <AercScore
                score={hasAerc.efficiency} max={hasAerc.efficiencyMax} synergizedScore={realValue && realValue.efficiency}
                name={short ? "F" : "Efficiency (F)"}
            />
            <AercScore
                score={hasAerc.disruption} max={hasAerc.disruptionMax} synergizedScore={realValue && realValue.disruption}
                name={short ? "D" : "Disruption (D)"}
            />
            <AercScore
                score={hasAerc.creatureProtection} max={hasAerc.creatureProtectionMax} synergizedScore={realValue && realValue.creatureProtection}
                name={short ? "CP" : "Creature Protection"}
            />
            <AercScore
                score={hasAerc.other} max={hasAerc.otherMax} synergizedScore={realValue && realValue.other} name={short ? "O" : "Other"}
            />
            {realValue == null ? (
                <AercScore
                    score={hasAerc.aercScore} max={hasAerc.aercScoreMax} name={"AERC"}
                />
            ) : (
                <AercAercScore score={realValue.aercScore} synergy={realValue.netSynergy}/>
            )}
        </div>
    )
}

const AercScore = (props: { score: number, max?: number, name: string, synergizedScore?: number, singleColumn?: boolean }) => {
    const {score, max, name, synergizedScore, singleColumn} = props
    if (score === 0 && max == null) {
        return null
    }
    let secondColumn
    if (max != null) {
        secondColumn = `${roundToHundreds(score)} to ${roundToHundreds(max)}`
    } else if (max == null && synergizedScore == null && !singleColumn) {
        secondColumn = roundToHundreds(score)
    }
    let thirdColumn = max == null && synergizedScore != null ? score : synergizedScore
    if (thirdColumn != null) {
        thirdColumn = roundToHundreds(thirdColumn)
    } else if (singleColumn) {
        thirdColumn = roundToHundreds(score)
    }
    return (
        <>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5), marginRight: spacing(1)}}>
                {name}:
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {secondColumn}
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {thirdColumn}
            </Typography>
        </>
    )
}

const AercAercScore = (props: { score: number, synergy: number }) => {
    const {score, synergy} = props
    if (score === 0) {
        return null
    }
    return (
        <>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5), marginRight: spacing(1)}}>
                AERC:
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {synergy === 0 ? "" : `${roundToHundreds(score - synergy)} ${synergy > 0 ? "+" : "-"} ${roundToHundreds(Math.abs(synergy))} =`}
            </Typography>
            <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>
                {roundToHundreds(score)}
            </Typography>
        </>
    )
}
