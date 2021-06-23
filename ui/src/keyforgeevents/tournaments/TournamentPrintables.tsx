import { Box, Paper, Typography } from "@material-ui/core"
import { grey } from "@material-ui/core/colors"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { themeStore } from "../../config/MuiConfig"
import { roundToHundreds } from "../../config/Utils"
import { TournamentPairingInfo } from "../../generated-src/TournamentPairingInfo"
import { TournamentRanking } from "../../generated-src/TournamentRanking"
import { TournamentRoundInfo } from "../../generated-src/TournamentRoundInfo"
import { SortableTable, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { LoaderBar } from "../../mui-restyled/Loader"
import { tournamentStore } from "./TournamentStore"

export const TournamentPrintables = observer(() => {

    const {id} = useParams<{ id: string }>()

    useEffect(() => {
        tournamentStore.tournamentInfo = undefined
        tournamentStore.findTourneyInfo(Number(id))
    }, [id])

    themeStore

    const info = tournamentStore.tournamentInfo

    return (
        <>
            <LoaderBar show={tournamentStore.loadingTournament}/>
            {info != null && (
                <Box>
                    <TournamentPrintableRankings rankings={info.rankings} roundNumber={info.rounds.length}/>
                    <Box mt={2}/>
                    <TournamentPrintablePairings roundInfo={info.rounds[info.rounds.length - 1]}/>
                    <Box mt={2}/>
                    <TournamentPrintableMatchSlips roundInfo={info.rounds[info.rounds.length - 1]}/>
                </Box>)}
        </>
    )
})

export const TournamentPrintableMatchSlips = (props: {
    roundInfo: TournamentRoundInfo
}) => {
    const {roundInfo} = props

    return (
        <Box p={2}>
            <Paper>
                <Box p={2}>
                    <Typography variant={"h5"}>Match Slips – Round {roundInfo.roundNumber}</Typography>
                </Box>
                {roundInfo.pairings.map(pairing => (
                    <Box display={"flex"} mx={2} py={6} key={pairing.table}>
                        <Typography variant={"subtitle1"} style={{width: 240}}>
                            Round {roundInfo.roundNumber} – Table {pairing.table}
                        </Typography>
                        <Typography variant={"subtitle1"} style={{width: 200}}>
                            ☐ {pairing.playerOneUsername}
                        </Typography>
                        <Typography variant={"subtitle1"} style={{width: 200}}>
                            ☐ {pairing.playerTwoUsername}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        </Box>
    )
}

export const TournamentPrintablePairings = (props: {
    roundInfo: TournamentRoundInfo
}) => {
    const {roundInfo} = props

    return (
        <Box p={2}>
            <Paper>
                <Box p={2}>
                    <Typography variant={"h5"}>Pairings – Round {roundInfo.roundNumber}</Typography>
                </Box>
                <SortableTable
                    headers={printablePairingsHeaders}
                    data={roundInfo.pairings}
                    defaultSort={"table"}
                    defaultSortDir={"asc"}
                    noOverflow={true}
                    rowBackgroundColor={rowData => (rowData.table % 2) === 1 ? undefined : grey[100]}
                />
            </Paper>
        </Box>
    )
}

export const TournamentPrintableRankings = (props: {
    rankings: TournamentRanking[], roundNumber: number
}) => {
    const {rankings, roundNumber} = props

    return (
        <Box p={2}>
            <Paper>
                <Box p={2}>
                    <Typography variant={"h5"}>Player Rankings – Round {roundNumber}</Typography>
                </Box>
                <SortableTable
                    headers={printableRankingsHeaders}
                    data={rankings}
                    defaultSort={"ranking"}
                    defaultSortDir={"asc"}
                    rowBackgroundColor={rowData => (rowData.ranking % 2) === 1 ? undefined : grey[100]}
                />
            </Paper>
        </Box>
    )
}

const printablePairingsHeaders: SortableTableHeaderInfo<TournamentPairingInfo>[] = [
    {property: "table"},
    {
        property: "playerOneUsername",
        title: "Player One",
    },
    {
        property: "playerTwoUsername",
        title: "Player Two",
    },
    {
        title: "Wins",
        transform: pairing => {
            if (pairing.playerTwoUsername == null) return pairing.playerOneWins
            return `${pairing.playerOneWins} – ${pairing.playerTwoWins}`
        }
    },
]


const printableRankingsHeaders: SortableTableHeaderInfo<TournamentRanking>[] = [
    {property: "ranking", title: "Rank"},
    {
        property: "username",
        title: "Player",
    },
    {property: "wins"},
    {property: "losses"},
    {property: "byes"},
    {property: "strengthOfSchedule", title: "SOS", transform: data => roundToHundreds(data.strengthOfSchedule)},
    {
        property: "extendedStrengthOfSchedule",
        title: "SOS+",
        transform: data => roundToHundreds(data.extendedStrengthOfSchedule),
    },
]
