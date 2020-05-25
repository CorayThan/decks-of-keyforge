import { Tooltip, Typography } from "@material-ui/core"
import { Info } from "@material-ui/icons"
import * as React from "react"
import { CardAsLine } from "../cards/views/CardAsLine"
import { spacing } from "../config/MuiConfig"
import { roundToHundreds } from "../config/Utils"
import { DeckWithSynergyInfo } from "../decks/Deck"
import { PercentRatingRow } from "../decks/DeckScoreView"
import { KeyCard } from "../generic/KeyCard"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { Loader } from "../mui-restyled/Loader"
import { SynergyCombo } from "./DeckSynergyInfo"
import { TraitBubble } from "./TraitBubble"

interface DeckSynergiesInfoViewProps {
    synergies: DeckWithSynergyInfo
}

export class DeckSynergiesInfoView extends React.Component<DeckSynergiesInfoViewProps> {

    render() {
        if (this.props.synergies == null) {
            return <Loader/>
        }

        const sasPercentile = this.props.synergies.deck.sasPercentile
        const {deck, antisynergyPercentile, synergyPercentile} = this.props.synergies
        const deckSynergyInfo = deck.synergies!
        const {synergyCombos} = deckSynergyInfo
        return (
            <KeyCard
                topContents={(
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant={"h4"} style={{color: "#FFFFFF", marginBottom: spacing(1), marginRight: spacing(1)}}>
                            Synergy Details
                        </Typography>
                        <div style={{display: "flex", alignItems: "flex-end", flexWrap: "wrap"}}>
                            <PercentRatingRow value={roundToHundreds(sasPercentile == null ? -1.0 : sasPercentile)} name={"SAS"}/>
                            <PercentRatingRow value={roundToHundreds(synergyPercentile)} name={"SYNERGY"}/>
                            <PercentRatingRow value={roundToHundreds(antisynergyPercentile)} name={"ANTISYNERGY"}/>
                            <div>
                                <Tooltip
                                    title={"Percentile ranking among all decks. Higher is better."}
                                >
                                    <Info style={{color: "white"}}/>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                )}
            >
                <SortableTable
                    headers={synergyDetailHeaders}
                    data={synergyCombos}
                    defaultSort={"aercScore"}
                />
            </KeyCard>
        )
    }
}

const synergyDetailHeaders: SortableTableHeaderInfo<SynergyCombo>[] = [
    {property: "cardName", transform: combo => <CardAsLine card={{cardTitle: combo.cardName}} cardActualHouse={combo.house}/>},
    {property: "copies"},
    {title: "Base AERC", sortable: false, transform: (combo) => roundToHundreds(combo.aercScore - combo.netSynergy)},
    {property: "netSynergy", transformProperty: roundToHundreds},
    {property: "aercScore", title: "AERC", transformProperty: roundToHundreds},
    {
        title: "Synergies",
        sortable: false,
        width: 320,
        transform: (combo) => {
            return combo.synergies.map((synergy, idx) => {
                return (
                    <div
                        key={idx}
                        style={{display: "flex", alignItems: "center"}}
                    >
                        <Typography style={{width: 48}}>{synergy.percentSynergized}%</Typography>
                        <TraitBubble
                            traitValue={synergy.trait}
                            synergyWith={synergy.traitCards}
                        />
                    </div>
                )
            })
        }
    },
    {property: "amberControl", transformProperty: roundToHundreds},
    {property: "expectedAmber", transformProperty: roundToHundreds},
    {property: "creatureProtection", transformProperty: roundToHundreds},
    {property: "artifactControl", transformProperty: roundToHundreds},
    {property: "creatureControl", transformProperty: roundToHundreds},
    {property: "effectivePower", transformProperty: roundToHundreds},
    {property: "efficiency", transformProperty: roundToHundreds},
    {property: "disruption", transformProperty: roundToHundreds},
    {property: "other", transformProperty: roundToHundreds},
]
