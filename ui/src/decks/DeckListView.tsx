import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@material-ui/core"
import { sortBy } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log } from "../config/Utils"
import { HouseBanner } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { Deck } from "./Deck"
import { DeckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"

interface DeckListViewProps {
    decks: Deck[]
}

export class DeckListView extends React.Component<DeckListViewProps> {
    render() {
        return (
            <>
                {this.props.decks.map((deck) => (
                    <DeckViewSmall key={deck.id} deck={deck}/>
                ))}
            </>
        )
    }
}

class DeckTableViewStore {
    @observable
    activeTableSort = ""
    @observable
    tableSortDir: "desc" | "asc" = "desc"

    resort = () => {
        if (DeckStore.instance.deckPage) {
            const decks: IObservableArray<Deck> = DeckStore.instance.deckPage.decks as IObservableArray<Deck>
            decks.replace(sortBy(decks.slice(), deckTableViewStore.activeTableSort))
            if (deckTableViewStore.tableSortDir === "desc") {
                log.info("Reversing table sort")
                decks.replace(decks.slice().reverse())
            }
        }
    }

    reset = () => {
        this.activeTableSort = ""
        this.tableSortDir = "desc"
    }
}

export const deckTableViewStore = new DeckTableViewStore()

@observer
export class DeckTableView extends React.Component<DeckListViewProps> {

    render() {
        return (
            <Paper style={{marginBottom: spacing(2)}}>
                <Table padding={"checkbox"}>
                    <TableHead>
                        <TableRow>
                            <DeckHeader title={"Name"} property={"name"} minWidth={152}/>
                            <TableCell>Houses</TableCell>
                            <DeckHeader title={"SAS"} property={"sasRating"}/>
                            <DeckHeader title={"Cards"} property={"cardsRating"}/>
                            <DeckHeader title={"Synergy"} property={"synergyRating"}/>
                            <DeckHeader title={"Antisyn"} property={"antisynergyRating"}/>
                            <DeckHeader title={"A"} property={"amberControl"}/>
                            <DeckHeader title={"E"} property={"expectedAmber"}/>
                            <DeckHeader title={"R"} property={"artifactControl"}/>
                            <DeckHeader title={"C"} property={"creatureControl"}/>
                            <DeckHeader title={"Creature Power"} property={"totalPower"}/>
                            <DeckHeader title={"Power"} property={"powerLevel"}/>
                            <DeckHeader title={"Chains"} property={"chains"}/>
                            <DeckHeader title={"Wins"} property={"wins"}/>
                            <DeckHeader title={"Losses"} property={"losses"}/>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.decks.map((deck) => (
                            <TableRow key={deck.id}>
                                <TableCell>
                                    <KeyLink style={{color: "rgba(0, 0, 0, 0.87)"}} noStyle={true} to={Routes.deckPage(deck.keyforgeId)}>
                                        {deck.name}
                                    </KeyLink>
                                </TableCell>
                                <TableCell><HouseBanner houses={deck.houses} size={36}/></TableCell>
                                <TableCell>{deck.sasRating}</TableCell>
                                <TableCell>{deck.cardsRating}</TableCell>
                                <TableCell>{deck.synergyRating}</TableCell>
                                <TableCell>{deck.antisynergyRating}</TableCell>
                                <TableCell>{deck.amberControl}</TableCell>
                                <TableCell>{deck.expectedAmber}</TableCell>
                                <TableCell>{deck.artifactControl}</TableCell>
                                <TableCell>{deck.creatureControl}</TableCell>
                                <TableCell>{deck.totalPower}</TableCell>
                                <TableCell>{deck.powerLevel}</TableCell>
                                <TableCell>{deck.chains}</TableCell>
                                <TableCell>{deck.wins}</TableCell>
                                <TableCell>{deck.losses}</TableCell>
                                <TableCell>
                                    <KeyLink
                                        to={Routes.deckPage(deck.keyforgeId)}
                                        noStyle={true}
                                    >
                                        <KeyButton color={"primary"} size={"small"}>View Deck</KeyButton>
                                    </KeyLink>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

const changeSortHandler = (property: string) => {
    return () => {
        if (deckTableViewStore.activeTableSort === property) {
            deckTableViewStore.tableSortDir = deckTableViewStore.tableSortDir === "desc" ? "asc" : "desc"
        } else {
            deckTableViewStore.activeTableSort = property
        }
        deckTableViewStore.resort()
    }
}

const DeckHeader = (props: { title: string, property: string, minWidth?: number }) => (
    <TableCell style={{minWidth: props.minWidth ? props.minWidth : undefined, maxWidth: 72}}>
        <TableSortLabel
            active={deckTableViewStore.activeTableSort === props.property}
            direction={deckTableViewStore.tableSortDir}
            onClick={changeSortHandler(props.property)}
        >
            {props.title}
        </TableSortLabel>
    </TableCell>
)
