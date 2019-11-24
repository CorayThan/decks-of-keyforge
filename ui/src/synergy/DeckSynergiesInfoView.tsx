import { TableSortLabel, Tooltip, Typography } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell, { TableCellProps } from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { Info } from "@material-ui/icons"
import { sortBy, startCase } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardAsLine } from "../cards/CardSimpleView"
import { spacing } from "../config/MuiConfig"
import { log, roundToHundreds } from "../config/Utils"
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
        this.update()
    }

    componentDidUpdate(prevProps: DeckSynergiesInfoViewProps): void {
        if (prevProps.synergies.deck.keyforgeId !== this.props.synergies.deck.keyforgeId) {
            this.update()
        }
    }

    update = () => {
        synergiesTableViewStore.synergyCombos = this.props.synergies.deck.synergies!.synergyCombos as IObservableArray<SynergyCombo>
        synergiesTableViewStore.resort()
    }

    render() {
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
                        <CardAsLine card={{cardTitle: combo.cardName}}/>
                        {combo.copies === 1 ? "" : ` x ${combo.copies}`}
                    </TableCell>
                    <TableCell>{roundToHundreds(combo.aercScore)} / {roundToHundreds(combo.netSynergy)}</TableCell>
                </>
            )
        } else {
            return (
                <>
                    <TableCell><CardAsLine card={{cardTitle: combo.cardName}}/></TableCell>
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

const TableCellRounded = (props: TableCellProps) => {
    const {children, ...rest} = props
    return (
        <TableCell {...rest}>
            {roundToHundreds(children as number)}
        </TableCell>
    )
}

class SynergiesTableViewStore {
    @observable
    activeTableSort = ""
    @observable
    tableSortDir: "desc" | "asc" = "desc"

    @observable
    synergyCombos?: IObservableArray<SynergyCombo>

    resort = () => {
        const sortWithField = this.activeTableSort.length > 0 ? this.activeTableSort : "aercScore"
        if (this.synergyCombos) {
            this.synergyCombos.replace(sortBy(this.synergyCombos.slice(), sortWithField))
            if (this.tableSortDir === "desc") {
                this.synergyCombos.replace(this.synergyCombos.slice().reverse())
            }
        }
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

const SynergiesHeader = observer((props: { title: string, property: string, minWidth?: number }) => {
    log.debug(`For header ${props.title} prop is ${props.property} active sort ${synergiesTableViewStore.activeTableSort} dir ${synergiesTableViewStore.tableSortDir}`)
    return (
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
})
