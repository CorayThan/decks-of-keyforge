import {Box, Button, IconButton, List, ListItem, Paper, Typography} from "@material-ui/core"
import {Clear} from "@material-ui/icons"
import {observer} from "mobx-react"
import React from "react"
import {spacing, theme, themeStore} from "../../config/MuiConfig"
import {Routes} from "../../config/Routes"
import {PatronButton} from "../../thirdpartysites/patreon/PatronButton"
import {screenStore} from "../../ui/ScreenStore"
import {userStore} from "../../user/UserStore"
import {theoreticalDeckStore} from "./TheoreticalDeckStore";
import {HouseImage} from "../../houses/HouseBanner";
import {keyLocalStorage} from "../../config/KeyLocalStorage";
import {KeyButton} from "../../mui-restyled/KeyButton";
import {useHistory} from "react-router-dom";

export const AllianceDeckPopover = observer(() => {

    const history = useHistory()

    const decks = keyLocalStorage.allianceDeckHouses
    const createAllianceDeck = keyLocalStorage.genericStorage.buildAllianceDeck
    if (!createAllianceDeck || decks.length === 0) {
        return null
    }

    const patron = userStore.patron

    return (
        <Box style={{
            position: "fixed",
            right: theme.spacing(2),
            bottom: theme.spacing(2),
            zIndex: screenStore.zindexes.keyDrawer
        }}>
            <Paper style={{background: themeStore.lightAmberBackground}}>
                {!patron && (
                    <Box p={2}>
                        <Typography
                            style={{marginBottom: spacing(2)}}
                        >
                            Please become a patron to build alliance decks!
                        </Typography>
                        <PatronButton/>
                    </Box>
                )}
                <List>
                    {decks.map(deck => (
                        <ListItem key={deck.deckId}>
                            <Box width={280} display={"flex"} alignItems={"center"}>
                                <HouseImage house={deck.house} size={24}/>
                                <Typography
                                    variant={"h5"}
                                    noWrap={true}
                                    style={{fontSize: 16, marginLeft: spacing(1)}}
                                >
                                    {deck.deckName}
                                </Typography>
                            </Box>
                            <IconButton
                                style={{marginLeft: spacing(2)}}
                                size={"small"}
                                onClick={() => keyLocalStorage.removeAllianceHouse(deck.deckId)}
                            >
                                <Clear fontSize={"small"}/>
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Button
                    onClick={() => {
                        keyLocalStorage.updateGenericStorage({buildAllianceDeck: false})
                        keyLocalStorage.clearAllianceDeck()
                    }}
                    variant={"outlined"}
                    style={{margin: spacing(2), marginRight: 0}}
                >
                    Clear
                </Button>
                <KeyButton
                    variant={"contained"}
                    color={"primary"}
                    style={{margin: spacing(2)}}
                    disabled={!patron || decks.length !== 3}
                    onClick={async () => {
                        const newDeckId = await theoreticalDeckStore.saveAllianceDeck()
                        keyLocalStorage.updateGenericStorage({buildAllianceDeck: false})
                        keyLocalStorage.clearAllianceDeck()
                        history.push(Routes.allianceDeckPage(newDeckId))
                    }}
                    loading={theoreticalDeckStore.savingDeck}
                >
                    Make Alliance
                </KeyButton>
            </Paper>
        </Box>
    )
})
