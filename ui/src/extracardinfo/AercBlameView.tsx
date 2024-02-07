import { AercBlame } from "../generated-src/AercBlame"
import React from "react"
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@material-ui/core"
import Typography from "@material-ui/core/Typography/Typography"
import { ExpandMore } from "@material-ui/icons"
import { theme } from "../config/MuiConfig"
import { JsonViewer } from "@textea/json-viewer"

export const AercBlameView = (props: { blame: AercBlame[] }) => {
    const blames = props.blame

    if (blames == null || blames.length === 0) {
        return null
    }

    return (
        <Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography
                        style={{
                            fontSize: theme.typography.pxToRem(15),
                            fontWeight: theme.typography.fontWeightRegular,
                        }}
                    >
                        Last edit by {blames[0].editor} on {blames[0].editDate}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display={"flex"} flexDirection={"column"}>
                        {blames.map((blame, idx) => (
                            <Box key={idx}>
                                <Typography variant={"subtitle1"}>Editor: {blame.editor}</Typography>
                                <Typography variant={"subtitle1"}>On: {blame.editDate}</Typography>
                                <Typography variant={"subtitle1"}>Prior Info</Typography>
                                <Box maxWidth={600}>
                                    <JsonViewer value={JSON.parse(blame.priorValue)}/>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}
