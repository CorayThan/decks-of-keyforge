import { Typography } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { startCase } from "lodash"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyCard } from "../generic/KeyCard"
import { DeckSynergyInfo } from "./DeckSynergyInfo"

interface DeckSynergiesInfoViewProps {
    synergies: DeckSynergyInfo
    width: number
}

export const DeckSynergiesInfoView = (props: DeckSynergiesInfoViewProps) => {
    const {synergyCombos} = props.synergies

    return (
        <KeyCard
            style={{width: props.width}}
            topContents={(
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end"}}>
                    <Typography variant={"h5"} style={{color: "#FFFFFF", marginBottom: spacing(1), marginRight: spacing(1)}}>
                        Synergy Details
                    </Typography>
                </div>
            )}
        >
            <Table padding={"dense"}>
                <TableHead>
                    <TableRow>
                        <TableCell>Card Name</TableCell>
                        <TableCell>Copies</TableCell>
                        <TableCell style={{maxWidth: 40}}>Rating (0 to 4)</TableCell>
                        <TableCell style={{maxWidth: 48}}>Synergy (-2 to 2)</TableCell>
                        <TableCell style={{maxWidth: 40}}>Value (0 to 5)</TableCell>
                        <TableCell>Synergies</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {synergyCombos.map((combo, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{combo.cardName}</TableCell>
                            <TableCell>{combo.copies}</TableCell>
                            <TableCell>{combo.cardRating}</TableCell>
                            <TableCell>{combo.netSynergy}</TableCell>
                            <TableCell>{combo.cardRating + combo.netSynergy}</TableCell>
                            <TableCell>
                                <div style={{display: "flex", flexWrap: "wrap", maxWidth: 280}}>
                                    {combo.synergies.map(synergy => (
                                        <TraitBubble key={synergy} name={startCase(synergy)} synergy={true}/>
                                    ))}
                                    {combo.antisynergies.map(antisynergy => (
                                        <TraitBubble key={antisynergy} name={startCase(antisynergy)} synergy={false}/>
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

const TraitBubble = (props: { name: string, synergy: boolean }) => (
    <span
        style={{
            borderRadius: 20,
            backgroundColor: props.synergy ? blue.A400 : amber.A400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: spacing(1),
            paddingLeft: spacing(2),
            paddingRight: spacing(2),
            margin: 4,
        }}
    >
        <Typography variant={"body2"} style={{fontSize: "0.8125rem", color: props.synergy ? "#FFFFFF" : undefined}}>{props.name}</Typography>
    </span>
)
