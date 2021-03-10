import { Box, Button, Paper } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { LoaderBar } from "../../mui-restyled/Loader"
import { uiStore } from "../../ui/UiStore"
import { UserSearchSuggest } from "../../user/search/UserSearchSuggest"
import { userStore } from "../../user/UserStore"
import { tournamentStore } from "./TournamentStore"

export const TournamentPage = observer(() => {

    const {id} = useParams<{ id: string }>()

    useEffect(() => {
        tournamentStore.findTourneyInfo(Number(id))
    }, [id])

    const info = tournamentStore.tournamentInfo

    return (
        <>
            <LoaderBar show={tournamentStore.loadingTournament}/>
            {info != null && (
                <TournamentView info={info}/>
            )}
        </>
    )
})

const TournamentView = observer((props: { info: TournamentInfo }) => {
    const {info} = props

    const {name, organizerUsername, rankings, rounds, tourneyId, joined, privateTournament} = info

    useEffect(() => {
        uiStore.setTopbarValues(name, name, "A KeyForge tournament")
    }, [name])

    const username = userStore.username
    const isOrganizer = username === organizerUsername

    const canJoin = !privateTournament && !joined && !isOrganizer && username != null

    return (
        <Box p={2} display={"flex"} alignItems={"center"} flexDirection={"column"}>
            {true && (
                <Box display={"flex"} justifyContent={"center"} mb={2}>
                    <Button
                        size={"large"}
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => tournamentStore.addParticipant(tourneyId, username!)}
                    >
                        Join this Tournament!
                    </Button>
                </Box>
            )}
            {isOrganizer && (
                <Paper>
                    <Box p={2} display={"flex"} flexWrap={"wrap"}>
                        <Box>
                            <Button
                                style={{marginRight: spacing(2)}}
                                variant={"contained"}
                                onClick={() => tournamentStore.startCurrentRound(tourneyId)}
                            >
                                Start Current Round
                            </Button>
                        </Box>
                        <Box>
                            <Button
                                style={{marginRight: spacing(2)}}
                                variant={"contained"}
                                onClick={() => tournamentStore.pairNextRound(tourneyId)}
                            >
                                Pair Next Round
                            </Button>
                        </Box>
                        <Box width={280} mr={2}>
                            <UserSearchSuggest
                                placeholderText={"Add participant with username..."}
                                onClick={(username) => tournamentStore.addParticipant(tourneyId, username)}
                            />
                        </Box>
                    </Box>
                </Paper>
            )}
        </Box>
    )
})

class TourneyPageStore {

    @observable
    users: string[] = []

    constructor() {
        makeObservable(this)
    }
}

const tourneyPageStore = new TourneyPageStore()
