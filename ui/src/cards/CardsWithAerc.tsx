import { Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { roundToHundreds } from "../config/Utils"
import { SynergyCombo } from "../synergy/DeckSynergyInfo"
import { cardStore } from "./CardStore"
import { KCard } from "./KCard"

export const CardsWithAerc = (props: { title: string, accessor: (card: Partial<KCard>) => number, cards?: KCard[], noScore?: boolean }) => {
    const {title, accessor, cards, noScore} = props
    const titleComponent = <Typography variant={"inherit"}>{title}</Typography>
    if (cards == null) {
        return titleComponent
    }
    const accessAerc = (card: KCard) => {
        const fullCard = cardStore.fullCardFromCardWithName(card)

        if (fullCard && fullCard.extraCardInfo) {
            return accessor(fullCard)
        }
        return 0
    }
    const filtered = cards
        .filter(card => accessAerc(card) !== 0)
    if (filtered.length === 0) {
        return titleComponent
    } else {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                {titleComponent}
                {filtered
                    .map((card, idx) => (
                        <Typography key={idx} variant={"inherit"}>
                            {noScore ? card.cardTitle : `${card.cardTitle} = ${accessAerc(card)}`}
                        </Typography>
                    ))}
            </div>
        )
    }
}

export const CardsWithAercFromCombos = (props: { title: string, accessor: (combo: SynergyCombo) => number, score?: number, combos?: SynergyCombo[] }) => {
    const {title, accessor, combos, score} = props
    const titleComponent = <Typography style={{marginBottom: spacing(1)}} variant={"inherit"}>{title}</Typography>
    if (combos == null) {
        return titleComponent
    }
    const filtered = combos
        .filter(combo => accessor(combo) !== 0)
    if (filtered.length === 0) {
        return titleComponent
    } else {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                {titleComponent}
                {filtered
                    .map((combo, idx) => (
                        <div style={{display: "flex"}} key={idx}>
                            <Typography variant={"inherit"} style={{marginRight: spacing(1)}}>
                                {`${combo.cardName}:`}
                            </Typography>
                            <div style={{flexGrow: 1}}/>
                            <Typography key={idx} variant={"inherit"}>
                                {`${roundToHundreds(accessor(combo))}` + (combo.copies > 1 ? ` x ${combo.copies} = ${roundToHundreds(accessor(combo) * combo.copies)}` : "")}
                            </Typography>
                        </div>
                    ))}
                {score != null && score !== 0 && (
                    <div style={{display: "flex", marginTop: spacing(1)}}>
                        <Typography variant={"inherit"} style={{flexGrow: 1}}>
                            Total:
                        </Typography>
                        <Typography variant={"inherit"}>
                            {roundToHundreds(score)}
                        </Typography>
                    </div>
                )}
            </div>
        )
    }
}
