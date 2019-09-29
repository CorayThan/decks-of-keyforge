import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import { GetApp } from "@material-ui/icons"
import React from "react"
import { CSVLink } from "react-csv"
import { AercForCard } from "../aerc/AercViews"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { TraitBubble } from "../synergy/TraitBubble"
import { CardSetsFromCard, CardSynergies } from "./CardSimpleView"
import { CardUtils, KCard } from "./KCard"

export const CardTableView = (props: { cards: KCard[] }) => {
    return (
        <div>
            <Paper style={{marginBottom: spacing(2), marginRight: spacing(2)}}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Sets</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Aember</TableCell>
                            <TableCell>Power</TableCell>
                            <TableCell>Armor</TableCell>
                            <TableCell>Text</TableCell>
                            <TableCell>AERC</TableCell>
                            <TableCell>Traits</TableCell>
                            <TableCell>Synergies</TableCell>
                            <TableCell>
                                <div style={{display: "flex"}}>
                                    <CSVLink
                                        data={CardUtils.arrayToCSV(props.cards)}
                                        target={"_blank"}
                                        filename={`dok-cards-${Utils.nowDateString()}.csv`}
                                    >
                                        <IconButton>
                                            <GetApp/>
                                        </IconButton>
                                    </CSVLink>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.cards.map(card => (
                            <TableRow key={card.id}>
                                <TableCell>{card.cardTitle}</TableCell>
                                <TableCell><CardSetsFromCard card={card} noDot={true}/></TableCell>
                                <TableCell>{card.cardType}</TableCell>
                                <TableCell>{card.amber}</TableCell>
                                <TableCell>{card.power}</TableCell>
                                <TableCell>{card.armor}</TableCell>
                                <TableCell>{card.cardText}</TableCell>
                                <TableCell><AercForCard card={card} short={true}/></TableCell>
                                <TableCell>
                                    <div style={{display: "flex", flexWrap: "wrap"}}>
                                        {card.extraCardInfo.traits.map(trait => (
                                            <TraitBubble key={trait} name={trait} positive={true} trait={true}/>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell> <CardSynergies card={card}/></TableCell>
                                <TableCell>
                                    <KeyLink
                                        to={Routes.cardPage(card.cardTitle)}
                                        noStyle={true}
                                    >
                                        <KeyButton color={"primary"} size={"small"}>View Card</KeyButton>
                                    </KeyLink>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    )
}