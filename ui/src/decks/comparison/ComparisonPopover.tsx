import { Box, Button, IconButton, List, ListItem, Paper, Typography } from "@material-ui/core"
import { Clear } from "@material-ui/icons"
import { observer } from "mobx-react"
import React from "react"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing, theme, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { PatronButton } from "../../thirdpartysites/patreon/PatronButton"
import { screenStore } from "../../ui/ScreenStore"
import { userStore } from "../../user/UserStore"

export const ComparisonPopover = observer(() => {
    const decks = keyLocalStorage.decksToCompare
    if (decks.length === 0 || userStore.loginInProgress) {
        return null
    }

    const patron = userStore.patron

    return (
        <Box style={{position: "fixed", right: theme.spacing(2), bottom: theme.spacing(2), zIndex: screenStore.zindexes.keyDrawer}}>
            <Paper style={{background: themeStore.lightAmberBackground}}>
                {!patron && (
                    <Box p={2}>
                        <Typography
                            style={{marginBottom: spacing(2)}}
                        >
                            Please become a patron to compare decks!
                        </Typography>
                        <PatronButton/>
                    </Box>
                )}
                <List>
                    {decks.map(deck => (
                        <ListItem key={deck.keyforgeId}>
                            <Box width={240}>
                                <Typography variant={"h5"} noWrap={true} style={{fontSize: 16}}>{deck.name}</Typography>
                            </Box>
                            <IconButton
                                style={{marginLeft: spacing(2)}}
                                size={"small"}
                                onClick={() => keyLocalStorage.removeDeckToCompare(deck.keyforgeId)}
                            >
                                <Clear fontSize={"small"}/>
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Button
                    onClick={keyLocalStorage.clearDeckstoCompare}
                    variant={"outlined"}
                    style={{margin: spacing(2), marginRight: 0}}
                >
                    Clear
                </Button>
                <LinkButton
                    variant={"contained"}
                    color={"primary"}
                    href={Routes.compareDecksWithIds(decks.map(deck => deck.keyforgeId))}
                    style={{margin: spacing(2)}}
                    disabled={!patron || decks.length < 2}
                >
                    Compare
                </LinkButton>
            </Paper>
        </Box>
    )
})
