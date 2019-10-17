import { TableSortLabel, Tooltip, Typography } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { Info } from "@material-ui/icons"
import { sortBy, startCase } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardAsLine } from "../cards/CardSimpleView"
import { spacing } from "../config/MuiConfig"
import { DeckWithSynergyInfo } from "../decks/Deck"
import { PercentRatingRow } from "../decks/DeckScoreView"
import { KeyCard } from "../generic/KeyCard"
import { screenStore } from "../ui/ScreenStore"
import { SynergyCombo } from "./DeckSynergyInfo"
import { TraitBubble } from "./TraitBubble"

interface DeckSynergiesInfoViewProps {
    synergies: DeckWithSynergyInfo
    width?: number
}

@observer
export class DeckSynergiesInfoView extends React.Component<DeckSynergiesInfoViewProps> {

    componentDidMount(): void {
        synergiesTableViewStore.synergyCombos = this.props.synergies.deck.synergies!.synergyCombos as IObservableArray<SynergyCombo>
    }

    componentWillReceiveProps(nextProps: Readonly<DeckSynergiesInfoViewProps>): void {
        synergiesTableViewStore.synergyCombos = nextProps.synergies.deck.synergies!.synergyCombos as IObservableArray<SynergyCombo>
    }

    render() {
        const sasPercentile = this.props.synergies.deck.sasPercentile
        const {deck, antisynergyPercentile, synergyPercentile} = this.props.synergies
        const deckSynergyInfo = deck.synergies!
        const {synergyCombos} = deckSynergyInfo
        return (
            <KeyCard
                style={{width: this.props.width}}
                topContents={(
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant={"h4"} style={{color: "#FFFFFF", marginBottom: spacing(1), marginRight: spacing(1)}}>
                            Synergy Details
                        </Typography>
                        <div style={{display: "flex", alignItems: "flex-end", flexWrap: "wrap"}}>
                            <PercentRatingRow value={(sasPercentile == null ? -1.0 : sasPercentile).toFixed(1)} name={"SAS"}/>
                            <PercentRatingRow value={synergyPercentile.toFixed(1)} name={"SYNERGY"}/>
                            <PercentRatingRow value={antisynergyPercentile.toFixed(1)} name={"ANTISYNERGY"}/>
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
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <ColumnHeaders/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {synergyCombos.map((combo, idx) => (
                            <TableRow key={idx}>
                                <CellValues combo={combo}/>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </KeyCard>
        )
    }
}

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
                    <SynergiesHeader title={"Synergy"} property={"netSynergy"}/>
                    <SynergiesHeader title={"Aerc"} property={"aerc"}/>
                    <TableCell>Synergies</TableCell>
                    <SynergiesHeader title={"Aember Control"} property={"amberControl"}/>
                    <SynergiesHeader title={"Expected Aember"} property={"expectedAmber"}/>
                    <SynergiesHeader title={"Aember Protection"} property={"amberProtection"}/>
                    <SynergiesHeader title={"Artifact Control"} property={"artifactControl"}/>
                    <SynergiesHeader title={"Creature Control"} property={"creatureControl"}/>
                    <SynergiesHeader title={"Effective Power"} property={"effectivePower"}/>
                    <SynergiesHeader title={"Efficiency"} property={"efficiency"}/>
                    <SynergiesHeader title={"Disruption"} property={"disruption"}/>
                    <SynergiesHeader title={"House Cheating"} property={"houseCheating"}/>
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
                        <CardAsLine card={{cardTitle: combo.cardName}}/>
                        {combo.copies === 1 ? "" : ` x ${combo.copies}`}
                    </TableCell>
                    <TableCell>{combo.aercScore} / {combo.netSynergy}</TableCell>
                </>
            )
        } else {
            return (
                <>
                    <TableCell><CardAsLine card={{cardTitle: combo.cardName}}/></TableCell>
                    <TableCell>{combo.copies}</TableCell>
                    <TableCell>{combo.netSynergy}</TableCell>
                    <TableCell>{combo.aercScore}</TableCell>
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
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </TableCell>
                    <TableCell>{combo.amberControl}</TableCell>
                    <TableCell>{combo.expectedAmber}</TableCell>
                    <TableCell>{combo.amberProtection}</TableCell>
                    <TableCell>{combo.artifactControl}</TableCell>
                    <TableCell>{combo.creatureControl}</TableCell>
                    <TableCell>{combo.effectivePower}</TableCell>
                    <TableCell>{combo.efficiency}</TableCell>
                    <TableCell>{combo.disruption}</TableCell>
                    <TableCell>{combo.houseCheating}</TableCell>
                </>
            )
        }
    }
}

class SynergiesTableViewStore {
    @observable
    activeTableSort = ""
    @observable
    tableSortDir: "desc" | "asc" = "desc"

    synergyCombos?: IObservableArray<SynergyCombo>

    resort = () => {
        if (this.synergyCombos) {
            if (synergiesTableViewStore.activeTableSort === "value") {
                this.synergyCombos.replace(sortBy(this.synergyCombos.slice(), (synergy: SynergyCombo) => {
                    return synergy.netSynergy + synergy.aercScore
                }))
            } else {
                this.synergyCombos.replace(sortBy(this.synergyCombos.slice(), synergiesTableViewStore.activeTableSort))
            }
            if (synergiesTableViewStore.tableSortDir === "desc") {
                this.synergyCombos.replace(this.synergyCombos.slice().reverse())
            }
        }
    }

    reset = () => {
        this.activeTableSort = ""
        this.tableSortDir = "desc"
    }
}

export const synergiesTableViewStore = new SynergiesTableViewStore()

const changeSortHandler = (property: string) => {
    return () => {
        if (synergiesTableViewStore.activeTableSort === property) {
            synergiesTableViewStore.tableSortDir = synergiesTableViewStore.tableSortDir === "desc" ? "asc" : "desc"
        } else {
            synergiesTableViewStore.activeTableSort = property
        }
        synergiesTableViewStore.resort()
    }
}

const SynergiesHeader = (props: { title: string, property: string, minWidth?: number }) => (
    <TableCell style={{minWidth: props.minWidth ? props.minWidth : undefined, maxWidth: 72}}>
        <TableSortLabel
            active={synergiesTableViewStore.activeTableSort === props.property}
            direction={synergiesTableViewStore.tableSortDir}
            onClick={changeSortHandler(props.property)}
        >
            {props.title}
        </TableSortLabel>
    </TableCell>
)
