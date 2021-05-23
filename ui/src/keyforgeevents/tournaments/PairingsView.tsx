import { Box, Grid, Typography } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { Star } from "@material-ui/icons"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { TournamentPairingInfo } from "../../generated-src/TournamentPairingInfo"
import { TournamentRoundInfo } from "../../generated-src/TournamentRoundInfo"
import { TournamentStage } from "../../generated-src/TournamentStage"
import { SortableTable, SortableTableContainer, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { UserLink } from "../../user/UserLink"
import { ReportResults } from "./ReportResults"

export const PairingsView = (props: {
    round: TournamentRoundInfo, tourneyId: number, stage: TournamentStage,
    isOrganizer: boolean, containsDecks: boolean, username?: string ,
}) => {

    const {round, tourneyId, stage, isOrganizer, containsDecks, username} = props
    return (
        <Grid item={true} xs={12} md={9} lg={8} xl={6}>
            <Box maxWidth={880}>
                <SortableTableContainer
                    title={`Round ${round.roundNumber} Pairings`}
                    titleTooltip={`Paired with ${Utils.enumNameToReadable(round.pairingStrategy)}`}
                >
                    <SortableTable
                        headers={roundPairingsTableHeaders(
                            tourneyId,
                            stage,
                            isOrganizer,
                            stage !== TournamentStage.PAIRING_IN_PROGRESS,
                            containsDecks,
                            username,
                        )}
                        data={round.pairings}
                        defaultSort={"table"}
                        defaultSortDir={"asc"}
                        rowBackgroundColor={(pairing) => {
                            if (stage == TournamentStage.GAMES_IN_PROGRESS && pairing.playerOneWon == null) {
                                return themeStore.darkMode ? blue["900"] : blue["50"]
                            }
                            return undefined
                        }}
                    />
                    {round.pairings.length === 0 && (
                        <Box p={2}>
                            <Typography color={"textSecondary"}>This round has not yet been paired.</Typography>
                        </Box>
                    )}
                </SortableTableContainer>
            </Box>
        </Grid>
    )
}

const roundPairingsTableHeaders = (
    tourneyId: number, stage: TournamentStage, isOrganizer: boolean, reportAvailable: boolean, containsDecks: boolean, username?: string
): SortableTableHeaderInfo<TournamentPairingInfo>[] => {

    const headers: SortableTableHeaderInfo<TournamentPairingInfo>[] = [
        {property: "table", sortable: true, padding: "checkbox"},
        {
            property: "playerOneUsername",
            title: "Player One",
            sortable: true,
            transform: (data) => {
                return (
                    <BoxScore username={data.playerOneUsername} winner={data.playerOneWon === true}/>
                )
            }
        },
        {
            property: "playerTwoUsername",
            title: "Player Two",
            sortable: true,
            transform: (data) => {
                if (data.playerTwoUsername == null) {
                    return "Bye"
                }
                return (
                    <BoxScore username={data.playerTwoUsername} winner={data.playerOneWon === false}/>
                )
            }
        },
        {
            title: "Wins",
            transform: pairing => {
                if (pairing.playerTwoUsername == null) return pairing.playerOneWins
                return `${pairing.playerOneWins} – ${pairing.playerTwoWins}`
            }
        },
        {
            title: "Score",
            transform: pairing => {
                if (pairing.playerOneScore == null) return ""
                return `${pairing.playerOneScore} – ${pairing.playerTwoScore ?? "None"}`
            },
            sortFunction: pairing => {
                return (pairing.playerOneScore ?? 0) + (pairing.playerTwoScore ?? 0)
            }
        },
    ]

    if (containsDecks) {
        headers.push(
            {
                title: "Decks",
                sortable: false,
                padding: "checkbox",
                transform: (data) => {
                    if (data.deckIds.length === 0) {
                        return null
                    }
                    return (
                        <LinkButton
                            href={Routes.compareDecksWithIds(data.deckIds)}
                            newWindow={true}
                        >
                            Decks
                        </LinkButton>
                    )
                }
            },
        )
    }

    headers.push(
        {
            padding: "checkbox",
            transform: (data) => {

                if (!reportAvailable) {
                    return null
                }
                if (username == null || (!isOrganizer && !(username === data.playerOneUsername || username === data.playerTwoUsername))) {
                    return null
                }
                if (data.playerTwoUsername == null) {
                    return null
                }
                return (
                    <ReportResults
                        tourneyId={tourneyId}
                        pairingId={data.pairId}
                        update={data.playerOneWon != null}
                        playerOne={data.playerOneUsername}
                        playerTwo={data.playerTwoUsername!}
                    />
                )
            }
        },
    )

    return headers
}

const BoxScore = (props: { username: string, winner?: boolean }) => {
    return (
        <Box display={"flex"} alignItems={"center"}>
            <UserLink username={props.username}/>
            {props.winner && <Star color={"primary"} style={{marginLeft: spacing(1)}}/>}
        </Box>
    )
}
