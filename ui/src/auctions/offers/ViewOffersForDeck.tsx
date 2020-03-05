import { Table, Typography } from "@material-ui/core"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { CardAsLine } from "../../cards/CardSimpleView"
import { roundToHundreds } from "../../config/Utils"
import { SynergyCombo } from "../../synergy/DeckSynergyInfo"
import { TraitBubble } from "../../synergy/TraitBubble"
import { screenStore } from "../../ui/ScreenStore"
import { OfferDto } from "./Offer"

export const ViewOffersForDeck = observer((props: { offers: OfferDto[] }) => {
    return (
        <Table size={"small"}>
            <TableHead>
                <TableRow>
                    <ColumnHeaders/>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.offers.map((offer, idx) => (
                    <TableRow key={idx}>
                        <CellValues offer={offer}/>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
})

@observer
class ColumnHeaders extends React.Component {
    render() {
        if (screenStore.screenSizeSm()) {
            return (
                <>
                    <TableCell>Card Name</TableCell>
                    <TableCell>AERC / Synergy</TableCell>
                </>
            )
        } else {
            return (
                <>
                    <SynergiesHeader title={"Card Name"} property={"cardName"}/>
                    <SynergiesHeader title={"Copies"} property={"copies"}/>
                    <TableCell>Base AERC</TableCell>
                    <SynergiesHeader title={"Synergy"} property={"netSynergy"}/>
                    <SynergiesHeader title={"AERC"} property={"aercScore"}/>
                    <TableCell>Synergies</TableCell>
                    {screenStore.screenWidth > 1440 && (
                        <>
                            <SynergiesHeader title={"Aember Control"} property={"amberControl"}/>
                            <SynergiesHeader title={"Expected Aember"} property={"expectedAmber"}/>
                            <SynergiesHeader title={"Aember Protection"} property={"amberProtection"}/>
                            <SynergiesHeader title={"Artifact Control"} property={"artifactControl"}/>
                            <SynergiesHeader title={"Creature Control"} property={"creatureControl"}/>
                            <SynergiesHeader title={"Effective Power"} property={"effectivePower"}/>
                            <SynergiesHeader title={"Efficiency"} property={"efficiency"}/>
                            <SynergiesHeader title={"Disruption"} property={"disruption"}/>
                            <SynergiesHeader title={"House Cheating"} property={"houseCheating"}/>
                            <SynergiesHeader title={"Other"} property={"other"}/>
                        </>
                    )}
                </>
            )
        }
    }
}

@observer
class CellValues extends React.Component<{ combo: SynergyCombo }> {
    render() {
        const combo = this.props.combo
        if (screenStore.screenSizeSm()) {
            return (
                <>
                    <TableCell>
                        <CardAsLine card={{cardTitle: combo.cardName}} cardActualHouse={combo.house}/>
                        {combo.copies === 1 ? "" : ` x ${combo.copies}`}
                    </TableCell>
                    <TableCell>{roundToHundreds(combo.aercScore)} / {roundToHundreds(combo.netSynergy)}</TableCell>
                </>
            )
        } else {
            return (
                <>
                    <TableCell><CardAsLine card={{cardTitle: combo.cardName}} cardActualHouse={combo.house}/></TableCell>
                    <TableCell>{combo.copies}</TableCell>
                    <TableCellRounded>{combo.aercScore - combo.netSynergy}</TableCellRounded>
                    <TableCellRounded>{combo.netSynergy}</TableCellRounded>
                    <TableCellRounded>{combo.aercScore}</TableCellRounded>
                    <TableCell>
                        <div>
                            {combo.synergies.map((synergy, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        style={{display: "flex", alignItems: "center"}}
                                    >
                                        <Typography style={{width: 48}}>{synergy.percentSynergized}%</Typography>
                                        <TraitBubble
                                            name={startCase(synergy.trait)}
                                            positive={synergy.rating > 0}
                                            synergyWith={synergy.traitCards}
                                            rating={synergy.rating}
                                            synTraitType={synergy.type}
                                            cardName={synergy.cardName}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </TableCell>
                    {screenStore.screenWidth > 1440 && (
                        <>
                            <TableCellRounded>{combo.amberControl}</TableCellRounded>
                            <TableCellRounded>{combo.expectedAmber}</TableCellRounded>
                            <TableCellRounded>{combo.amberProtection}</TableCellRounded>
                            <TableCellRounded>{combo.artifactControl}</TableCellRounded>
                            <TableCellRounded>{combo.creatureControl}</TableCellRounded>
                            <TableCellRounded>{combo.effectivePower}</TableCellRounded>
                            <TableCellRounded>{combo.efficiency}</TableCellRounded>
                            <TableCellRounded>{combo.disruption}</TableCellRounded>
                            <TableCellRounded>{combo.houseCheating}</TableCellRounded>
                            <TableCellRounded>{combo.other}</TableCellRounded>
                        </>
                    )}
                </>
            )
        }
    }
}
