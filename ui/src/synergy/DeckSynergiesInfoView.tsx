import { Tooltip, Typography } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { Info } from "@material-ui/icons"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { CardAsLine } from "../cards/CardSimpleView"
import { spacing } from "../config/MuiConfig"
import { DeckWithSynergyInfo } from "../decks/Deck"
import { PercentRatingRow } from "../decks/DeckScoreView"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { KeyCard } from "../generic/KeyCard"
import { screenStore } from "../ui/ScreenStore"
import { SynergyCombo } from "./DeckSynergyInfo"
import { TraitBubble } from "./TraitBubble"

interface DeckSynergiesInfoViewProps {
    synergies: DeckWithSynergyInfo
    width?: number
}

export const DeckSynergiesInfoView = (props: DeckSynergiesInfoViewProps) => {
    const {deckSynergyInfo, antisynergyPercentile, synergyPercentile, cardRatingPercentile, sasPercentile} = props.synergies
    const {synergyCombos} = deckSynergyInfo
    return (
        <KeyCard
            style={{width: props.width}}
            topContents={(
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant={"h4"} style={{color: "#FFFFFF", marginBottom: spacing(1), marginRight: spacing(1)}}>
                        Synergy Details
                    </Typography>
                    <div style={{display: "flex", alignItems: "flex-end", flexWrap: "wrap"}}>
                        <PercentRatingRow value={sasPercentile} name={"SAS"}/>
                        <PercentRatingRow value={cardRatingPercentile} name={"CARD RATING"}/>
                        <PercentRatingRow value={synergyPercentile} name={"SYNERGY"}/>
                        <PercentRatingRow value={antisynergyPercentile} name={"ANTISYNERGY"}/>
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
            <Table padding={"dense"}>
                <TableHead>
                    <TableRow>
                        <ColumnHeaders/>
                        <TableCell>Synergies</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {synergyCombos.map((combo, idx) => (
                        <TableRow key={idx}>
                            <CellValues combo={combo}/>
                            <TableCell>
                                <div style={{display: "flex", flexWrap: "wrap", maxWidth: 280}}>
                                    {combo.synergies.map(synergy => (
                                        <TraitBubble key={synergy} name={startCase(synergy)} positive={true}/>
                                    ))}
                                    {combo.antisynergies.map(antisynergy => (
                                        <TraitBubble key={antisynergy} name={startCase(antisynergy)} positive={false}/>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </KeyCard>
    )
}

@observer
class ColumnHeaders extends React.Component {
    render() {
        if (screenStore.screenSizeXs()) {
            return (
                <>
                    <TableCell>Card Name</TableCell>
                    <TableCell>Rating / Synergy</TableCell>
                </>
            )
        } else {
            return (
                <>
                    <TableCell>Card Name</TableCell>
                    <TableCell>Copies</TableCell>
                    <TableCell>Rating (0 to 4)</TableCell>
                    <TableCell>Synergy (-2 to 2)</TableCell>
                    <TableCell>Value (0 to 5)</TableCell>
                </>
            )
        }
    }
}

@observer
class CellValues extends React.Component<{ combo: SynergyCombo }> {
    render() {
        const combo = this.props.combo
        const cardLine = <CardAsLine card={{cardTitle: combo.cardName}}/>
        if (screenStore.screenSizeXs()) {
            return (
                <>
                    <TableCell>{cardLine}{combo.copies === 1 ? "" : ` x ${combo.copies}`}</TableCell>
                    <TableCell>{combo.cardRating} / {combo.netSynergy}</TableCell>
                </>
            )
        } else {
            return (
                <>
                    <TableCell>{cardLine}</TableCell>
                    <TableCell>{combo.copies}</TableCell>
                    <TableCell>
                        <div style={{display: "flex", alignItems: "center"}}>
                            {combo.cardRating}
                            <CardQualityIcon quality={combo.cardRating + 1} style={{marginLeft: spacing(1)}}/>
                        </div>
                    </TableCell>
                    <TableCell>{combo.netSynergy}</TableCell>
                    <TableCell>{combo.cardRating + combo.netSynergy}</TableCell>
                </>
            )
        }
    }
}
