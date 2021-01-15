import { Box, Divider, Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { Fragment } from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { DifferenceAmount } from "../../generated-src/DifferenceAmount"
import { AercIcon, AercType } from "../../generic/icons/aerc/AercIcon"
import { ArrowQuality, ArrowQualityIcon } from "../../generic/icons/ArrowQualityIcon"
import { ArtifactIcon } from "../../generic/icons/card-types/ArtifactIcon"
import { CreatureIcon } from "../../generic/icons/card-types/CreatureIcon"
import { screenStore } from "../../ui/ScreenStore"
import { DeckCompareValue } from "./CompareDecks"

const isSecondColumn = (stat: string) => stat.includes("Count") || stat.includes("Efficiency") || stat.includes("Disruption")

export const DeckComparisonSummary = observer((props: { results: DeckCompareValue[] }) => {
    const results = props.results

    const aercResults = results.filter(result => !isSecondColumn(result.stat))
    const countResults = results.filter(result => isSecondColumn(result.stat))

    const smallView = screenStore.smallDeckView()

    return (
        <Paper
            style={{
                margin: spacing(1),
                padding: spacing(2),
                backgroundColor: themeStore.aercViewBackground,
                overflowY: "auto",
                height: smallView ? 360 : 216,
                width: smallView ? 328 : undefined
            }}
        >
            <Typography variant={"h5"} style={{fontSize: 20}}>Comparison Summary</Typography>
            <Divider style={{width: smallView ? 280 : 640, marginTop: spacing(1), marginBottom: spacing(1)}}/>
            <Box>
                {props.results.length === 0 && (
                    <Typography>
                        No significant stat differences
                    </Typography>
                )}
                {smallView ? (
                    <DeckComparisonList results={results} width={280}/>
                ) : (
                    <Box display={"flex"}>
                        <DeckComparisonList results={aercResults} width={320}/>
                        <Box ml={2}>
                            <DeckComparisonList results={countResults} width={320}/>
                        </Box>
                    </Box>
                )}
            </Box>
        </Paper>
    )
})

const DeckComparisonList = (props: { results: DeckCompareValue[], width: number }) => {
    return (
        <Box display={"grid"} gridTemplateColumns={"1fr 1fr 10fr"} gridGap={8} width={props.width}>
            {props.results.map(result => {
                let quality: ArrowQuality | undefined
                if (result.significantlyDifferent !== DifferenceAmount.MINIMAL) {
                    if (result.significantlyDifferent === DifferenceAmount.MODERATE) {
                        if (result.valueDiff > 0) {
                            quality = ArrowQuality.BETTER
                        } else {
                            quality = ArrowQuality.WORSE
                        }
                    } else {
                        if (result.valueDiff > 0) {
                            quality = ArrowQuality.BEST
                        } else {
                            quality = ArrowQuality.WORST
                        }
                    }
                }
                let icon
                if (result.stat === "SAS") {
                    icon = <Typography color={"primary"} variant={"h5"} style={{fontSize: 16}}>SAS</Typography>
                } else if (result.stat === "Aember Control") {
                    icon = <AercIcon type={AercType.A}/>
                } else if (result.stat === "Expected Aember") {
                    icon = <AercIcon type={AercType.E}/>
                } else if (result.stat === "Artifact Control") {
                    icon = <AercIcon type={AercType.R}/>
                } else if (result.stat === "Creature Control") {
                    icon = <AercIcon type={AercType.C}/>
                } else if (result.stat === "Efficiency") {
                    icon = <AercIcon type={AercType.F}/>
                } else if (result.stat === "Disruption") {
                    icon = <AercIcon type={AercType.D}/>
                } else if (result.stat === "Creature Count") {
                    icon = <CreatureIcon/>
                } else if (result.stat === "Artifact Count") {
                    icon = <ArtifactIcon/>
                }
                const height = 28
                return (
                    <Fragment key={result.stat}>
                        <Box display={"flex"} height={height}>
                            {quality != null && !result.stat.includes("Count") ? (
                                <ArrowQualityIcon arrowQuality={quality} style={{marginRight: spacing(1)}}/>
                            ) : (
                                <Box width={32}/>
                            )}
                            {icon}
                        </Box>
                        <Box display={"flex"} justifyContent={"flex-end"} height={height} alignItems={"center"}>
                            <Typography style={{marginRight: spacing(1)}}>
                                {result.valueDiff > 0 ? "+" : ""}{result.valueDiff.toFixed(1)}
                            </Typography>
                        </Box>

                        <Box height={height} alignItems={"center"}>
                            <Typography>{result.stat}</Typography>
                        </Box>
                    </Fragment>
                )
            })}
        </Box>
    )
}
