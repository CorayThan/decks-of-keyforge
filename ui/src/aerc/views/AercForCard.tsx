import { Typography } from "@material-ui/core"
import * as React from "react"
import { cardStore } from "../../cards/CardStore"
import { CardType } from "../../cards/CardType"
import { KCard } from "../../cards/KCard"
import { spacing, theme } from "../../config/MuiConfig"
import { roundToHundreds, roundToTens } from "../../config/Utils"
import { SynergyCombo } from "../../synergy/DeckSynergyInfo"
import { userStore } from "../../user/UserStore"

export const AercForCard = (props: { card: KCard, short?: boolean, realValue?: SynergyCombo }) => {
    const {card, short, realValue} = props
    const info = card.extraCardInfo
    return (
        <div style={{display: "grid", gridTemplateColumns: "6fr 4fr 2fr"}}>
            {userStore.contentCreator && cardStore.nextAdaptiveScore(card.cardTitle) !== 0 && (
                <AercScore
                    score={cardStore.nextAdaptiveScore(card.cardTitle)}
                    name={"Adaptive Score"}
                />
            )}
            <AercScore
                score={info.amberControl}
                max={info.amberControlMax}
                synergizedScore={realValue && realValue.amberControl}
                name={short ? "A" : "Aember Control (A)"}
            />
            <AercScore
                score={info.expectedAmber}
                max={info.expectedAmberMax}
                synergizedScore={realValue && realValue.expectedAmber}
                name={short ? "E" : "Expected Aember (E)"}
            />
            <AercScore
                score={info.artifactControl}
                max={info.artifactControlMax}
                synergizedScore={realValue && realValue.artifactControl}
                name={short ? "R" : "Artifact Control (R)"}
            />
            <AercScore
                score={info.creatureControl}
                max={info.creatureControlMax}
                synergizedScore={realValue && realValue.creatureControl}
                name={short ? "C" : "Creature Control (C)"}
            />
            <AercScore
                score={roundToTens(info.effectivePower / 10)}
                max={info.effectivePowerMax != null ? roundToTens(info.effectivePowerMax / 10) : undefined}
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
                score={info.efficiency}
                max={info.efficiencyMax}
                synergizedScore={realValue && realValue.efficiency}
                name={short ? "F" : "Efficiency (F)"}
            />
            <AercScore
                score={info.recursion}
                max={info.recursionMax}
                synergizedScore={realValue && realValue.recursion}
                name={short ? "U" : "Recursion (U)"}
            />
            <AercScore
                score={info.disruption}
                max={info.disruptionMax}
                synergizedScore={realValue && realValue.disruption}
                name={short ? "D" : "Disruption (D)"}
            />
            <AercScore
                score={info.creatureProtection}
                max={info.creatureProtectionMax}
                synergizedScore={realValue && realValue.creatureProtection}
                name={short ? "CP" : "Creature Protection"}
            />
            <AercScore
                score={info.other}
                max={info.otherMax}
                synergizedScore={realValue && realValue.other}
                name={short ? "O" : "Other"}
            />
            {realValue == null ? (
                <AercScore
                    score={card.aercScore} max={card.aercScoreMax} name={"AERC"}
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
