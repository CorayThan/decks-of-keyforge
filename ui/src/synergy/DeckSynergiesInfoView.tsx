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
import { log, prettyJson } from "../config/Utils"
import { DeckWithSynergyInfo } from "../decks/Deck"
import { PercentRatingRow } from "../decks/DeckScoreView"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { KeyCard } from "../generic/KeyCard"
import { AercScoreView } from "../stats/AercScoreView"
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
        synergiesTableViewStore.synergyCombos = this.props.synergies.deckSynergyInfo.synergyCombos as IObservableArray<SynergyCombo>
    }

    componentWillReceiveProps(nextProps: Readonly<DeckSynergiesInfoViewProps>): void {
        synergiesTableViewStore.synergyCombos = nextProps.synergies.deckSynergyInfo.synergyCombos as IObservableArray<SynergyCombo>
    }

    render() {
        const {deckSynergyInfo, antisynergyPercentile, synergyPercentile, cardRatingPercentile, sasPercentile} = this.props.synergies
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
                <Table padding={"checkbox"}>
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
            log.info("Column headers screen size small")
            return (
                <>
                    <TableCell>Card Name</TableCell>
                    <TableCell>Rating / Synergy</TableCell>
                </>
            )
        } else {
            return (
                <>
                    <SynergiesHeader title={"Card Name"} property={"cardName"}/>
                    <SynergiesHeader title={"Copies"} property={"copies"}/>
                    <SynergiesHeader title={"Rating (0 to 4)"} property={"cardRating"}/>
                    <SynergiesHeader title={"Synergy (-2 to 2)"} property={"netSynergy"}/>
                    <SynergiesHeader title={"Value"} property={"value"}/>
                    <TableCell>Synergies</TableCell>
                    <SynergiesHeader title={"AERC"} property={"aerc"}/>
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
                    <TableCell>
                        <AercScoreView
                            hasAerc={{
                                aercScore: combo.amberControl + combo.expectedAmber + combo.artifactControl
                                    + combo.deckManipulation + combo.creatureControl + combo.effectivePower,
                                ...combo
                            }}
                            dark={true}
                            narrow={true}
                        />
                    </TableCell>
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
                    return synergy.netSynergy + synergy.cardRating
                }))
            } else if (synergiesTableViewStore.activeTableSort === "aerc") {
                this.synergyCombos.replace(sortBy(this.synergyCombos.slice(), (combo: SynergyCombo) => {
                    return combo.amberControl + combo.expectedAmber + combo.artifactControl + combo.deckManipulation + combo.creatureControl
                        + combo.effectivePower
                }))
            } else {
                log.debug(`Synergy combos right now: ${prettyJson(this.synergyCombos)}`)
                this.synergyCombos.replace(sortBy(this.synergyCombos.slice(), synergiesTableViewStore.activeTableSort))
                log.debug(`Synergy combos right now: ${prettyJson(this.synergyCombos)}`)
            }
            if (synergiesTableViewStore.tableSortDir === "desc") {
                log.info("Reversing table sort")
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

