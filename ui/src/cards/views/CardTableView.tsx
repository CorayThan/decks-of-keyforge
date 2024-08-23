import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { AercForCard } from "../../aerc/views/AercForCard"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { CsvDownloadButton } from "../../generic/CsvDownloadButton"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { CardUtils } from "../KCard"
import { CardSetsFromCard, CardSynergies, CardTraits } from "./CardSupplementalViews"
import { FrontendCard } from "../../generated-src/FrontendCard"

export const CardTableView = observer((props: { cards: FrontendCard[] }) => {
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
                                    <CsvDownloadButton name={"cards"} data={CardUtils.arrayToCSV(props.cards)}/>
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
                                    <CardTraits traits={card.extraCardInfo.traits}/>
                                </TableCell>
                                <TableCell>
                                    <CardSynergies synergies={card.extraCardInfo.synergies}/>
                                </TableCell>
                                <TableCell>
                                    <KeyLink
                                        to={Routes.cardPage(card.cardTitle)}
                                        noStyle={true}
                                    >
                                        <KeyButton color={themeStore.darkMode ? "secondary" : "primary"} size={"small"}>View Card</KeyButton>
                                    </KeyLink>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    )
})