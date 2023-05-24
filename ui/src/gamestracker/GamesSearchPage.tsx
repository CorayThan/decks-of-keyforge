import {observer} from "mobx-react"
import React, {useState} from "react"
import {Box, Button, Dialog, DialogContent, DialogTitle, Paper, TextField, Typography} from "@material-ui/core";
import {userStore} from "../user/UserStore";
import {KeyButton} from "../mui-restyled/KeyButton";
import {gamesTrackerStore} from "./GamesTrackerStore";
import {KeyUserDto} from "../generated-src/KeyUserDto";
import {Loader} from "../mui-restyled/Loader";
import {SortableTable, SortableTableHeaderInfo} from "../generic/SortableTable";
import {TimeUtils} from "../config/TimeUtils";
import {MiniGameRecord} from "../generated-src/MiniGameRecord";
import {spacing} from "../config/MuiConfig";
import {MiniDeckLink} from "../decks/buttons/MiniDeckLink";

export const GamesSearchPage = observer(() => {
    const user = userStore.user
    if (user == null) {
        return <Loader/>
    }
    return <GamesSearchPageWithUser user={user}/>
})

const headers: SortableTableHeaderInfo<MiniGameRecord>[] = [
    {property: "playerOne", title: "First Player", sortable: true},
    {
        property: "playerOneDeck",
        title: "First Deck",
        sortable: true,
        transform: (data) => <MiniDeckLink deck={data.playerOneDeck}/>
    },
    {property: "playerTwo", title: "Second Player", sortable: true},
    {
        property: "playerTwoDeck",
        title: "Second Deck",
        sortable: true,
        transform: (data) => <MiniDeckLink deck={data.playerTwoDeck}/>
    },
    {property: "winner", sortable: true},
    {
        property: "reportDayTime",
        title: "Date",
        sortable: true,
        sortFunction: (data) => TimeUtils.parseReadableLocalDateTime(data.reportDayTime).getTime()
    },
    {title: "Game Log", sortable: false, transform: (data) => <GameLogDialog logs={data.logs}/>}
]

const GameLogDialog = (props: { logs: string[] }) => {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Button onClick={handleClickOpen}>Open Game Log</Button>
            <Dialog onClose={handleClose} aria-labelledby="game-log-title" open={open}>
                <DialogTitle id="game-log-title">Game Log</DialogTitle>
                <DialogContent>
                    {props.logs.map((log, idx) => (
                        <Typography key={idx}>{log}</Typography>
                    ))}
                </DialogContent>
            </Dialog>
        </>
    )
}

const GamesSearchPageWithUser = observer((props: { user: KeyUserDto }) => {
    const [tco, setTco] = useState(props.user?.tcoUsername ?? "")

    const games = gamesTrackerStore.games

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <Paper style={{margin: spacing(2), padding: spacing(2), maxWidth: 1600}}>
                <Box display={"flex"} alignItems={"center"}>
                    <TextField
                        variant={"outlined"}
                        title={"tco username"}
                        value={tco}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setTco(event.target.value)
                        }}
                    />
                    <KeyButton
                        variant={"outlined"}
                        style={{marginLeft: spacing(2)}}
                        disabled={tco == "" || gamesTrackerStore.searching}
                        loading={gamesTrackerStore.searching}
                        onClick={() => {
                            gamesTrackerStore.searchGames({
                                tcoPlayerName: tco
                            })
                        }}
                    >
                        Search games for TCO username
                    </KeyButton>
                </Box>

                {games?.gamesList != null && (
                    <SortableTable
                        defaultSort={"reportDayTime"}
                        data={games.gamesList}
                        headers={headers}
                    />
                )}

            </Paper>
        </Box>
    )
})