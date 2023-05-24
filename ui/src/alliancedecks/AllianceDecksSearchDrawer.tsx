import { Box, FormGroup, IconButton, Tooltip } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { BarChart, Close, ViewList, ViewModule } from "@material-ui/icons"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import * as History from "history"
import { observer } from "mobx-react"
import * as React from "react"
import { ExpansionSelectOrExclude } from "../expansions/ExpansionSelectOrExclude";
import { HouseSelectOrExclude } from "../houses/HouseSelectOrExclude";
import { AllianceDeckSortSelect } from "./AllianceDeckSortSelect"
import { messageStore } from "../ui/MessageStore";
import { Routes } from "../config/Routes";
import { KeyDrawer, keyDrawerStore, KeyDrawerVersion } from "../components/KeyDrawer";
import { userStore } from "../user/UserStore";
import { SortDirectionView } from "../components/SortDirectionView";
import { screenStore } from "../ui/ScreenStore";
import { spacing } from "../config/MuiConfig";
import { UserLink } from "../user/UserLink";
import { UserSearchSuggest } from "../user/search/UserSearchSuggest";
import { KeyButton } from "../mui-restyled/KeyButton";
import { keyLocalStorage } from "../config/KeyLocalStorage";
import { allianceDeckStore } from "./AllianceDeckStore";
import { ArrayUtils } from "../config/ArrayUtils";
import { allianceFiltersStore } from "./AllianceFiltersStore";
import { LinkButton } from "../mui-restyled/LinkButton";

interface AllianceDecksSearchDrawerProps {
    location: History.Location
    history: History.History
}

@observer
export class AllianceDecksSearchDrawer extends React.Component<AllianceDecksSearchDrawerProps> {

    handleMyDecksUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const username = userStore.username
        if (event.target.checked) {
            ArrayUtils.addIfDoesntExist(allianceFiltersStore.owners, username)
        } else {
            ArrayUtils.removeIfContains(allianceFiltersStore.owners, username)
        }
    }
    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }

        if (!allianceFiltersStore.selectedHouses.validHouseSelection()) {
            messageStore.setWarningMessage("You may select up to 3 houses with houses excluded, and exclude all but 3.")
            return
        }

        const filters = allianceFiltersStore.makeFilters()

        this.props.history.push(Routes.allianceDeckSearch(filters))
        keyDrawerStore.closeIfSmall()
    }

    render() {

        const showMyDecks = userStore.loggedIn()

        const count = allianceDeckStore.decksCount?.count

        const myDecks = allianceFiltersStore.owners.length === 1 && allianceFiltersStore.owners[0] === userStore.username

        return (
            <KeyDrawer version={KeyDrawerVersion.DECK}>
                <form onSubmit={this.search}>
                    <List dense={true}>
                        <ListItem>
                            <TextField
                                label={"Alliance Name"}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => allianceFiltersStore.title = event.target.value}
                                value={allianceFiltersStore.title}
                                fullWidth={!screenStore.screenSizeXs()}
                            />
                            <div style={{flexGrow: 1}}/>
                            {screenStore.screenSizeXs() ? (
                                <IconButton onClick={() => keyDrawerStore.open = false}>
                                    <Close/>
                                </IconButton>
                            ) : null}
                        </ListItem>
                        <ListItem style={{marginTop: spacing(2)}}>
                            <ExpansionSelectOrExclude selectedExpansions={allianceFiltersStore.selectedExpansions}/>
                        </ListItem>
                        <ListItem style={{marginTop: spacing(1)}}>
                            <div>
                                <Typography variant={"subtitle1"} color={"textSecondary"}>Options</Typography>
                                <FormGroup row={true}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={myDecks}
                                                onChange={this.handleMyDecksUpdate}
                                                disabled={!showMyDecks}
                                            />
                                        }
                                        label={<Typography variant={"body2"}>My Alliances</Typography>}
                                        style={{width: 136}}
                                    />
                                </FormGroup>
                            </div>
                        </ListItem>
                        <ListItem>
                            <Box minWidth={232}>
                                {allianceFiltersStore.owners.length > 0 && (
                                    <div>
                                        <Typography variant={"subtitle2"}>
                                            Alliances owned by
                                        </Typography>
                                        <Box display={"flex"} flexWrap={"wrap"}>
                                            {allianceFiltersStore.owners.map(ownedBy => (
                                                <Box
                                                    key={ownedBy}
                                                    display={"flex"}
                                                    alignItems={"center"}
                                                    style={{margin: spacing(1, 1, 0, 0)}}
                                                >
                                                    <UserLink username={ownedBy}/>
                                                    <IconButton
                                                        style={{marginLeft: spacing(1)}}
                                                        size={"small"}
                                                        onClick={() => allianceFiltersStore.owners = allianceFiltersStore.owners.filter(toFilter => toFilter !== ownedBy)}
                                                    >
                                                        <Close fontSize={"small"}/>
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </div>
                                )}
                                <UserSearchSuggest
                                    usernames={allianceFiltersStore.owners}
                                    placeholderText={"Search alliances owned by..."}
                                />
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box>
                                <Typography variant={"subtitle1"} color={"textSecondary"}>Houses</Typography>
                                <HouseSelectOrExclude selectedHouses={allianceFiltersStore.selectedHouses}
                                                      excludeTitle={true}/>
                            </Box>
                        </ListItem>
                        <ListItem style={{marginTop: spacing(1)}}>
                            <AllianceDeckSortSelect store={allianceFiltersStore.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={allianceFiltersStore}/>
                            </div>
                        </ListItem>
                        <ListItem style={{marginTop: spacing(1)}}>
                            <div style={{display: "flex", marginTop: spacing(1), marginBottom: spacing(1)}}>
                                <KeyButton
                                    variant={"outlined"}
                                    onClick={allianceFiltersStore.reset}
                                    style={{marginRight: spacing(2)}}
                                >
                                    Clear
                                </KeyButton>
                                <KeyButton
                                    variant={"contained"}
                                    color={"secondary"}
                                    type={"submit"}
                                    loading={allianceDeckStore.searchingForDecks}
                                    disabled={allianceDeckStore.searchingForDecks}
                                >
                                    Search
                                </KeyButton>
                            </div>
                        </ListItem>
                        {count != null && (
                            <ListItem>
                                <Typography variant={"subtitle2"} style={{marginBottom: spacing(1)}}>
                                    {`You found ${count}${count === 1000 || count === 10000 ? "+ " : ""} alliances`}
                                </Typography>
                            </ListItem>
                        )}
                        {allianceDeckStore.countingDecks ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>Counting ...</Typography>
                            </ListItem>
                        ) : null}
                        <ListItem>
                            <Box display={"flex"} alignItems={"center"}>
                                <Tooltip title={"View type"}>
                                    <ToggleButtonGroup
                                        value={keyLocalStorage.deckListViewType}
                                        exclusive={true}
                                        onChange={(event, viewType) => {
                                            keyLocalStorage.setDeckListViewType(viewType)
                                        }}
                                        style={{marginRight: spacing(2)}}
                                        size={"small"}
                                    >
                                        <ToggleButton value={"grid"}>
                                            <ViewModule/>
                                        </ToggleButton>
                                        <ToggleButton value={"graphs"}>
                                            <BarChart/>
                                        </ToggleButton>
                                        <ToggleButton value={"table"}>
                                            <ViewList/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Tooltip>
                                <Tooltip title={"Page size"}>
                                    <ToggleButtonGroup
                                        value={keyLocalStorage.deckPageSize}
                                        exclusive={true}
                                        onChange={(event, size) => {
                                            keyLocalStorage.setDeckPageSize(size)
                                            this.search()
                                        }}
                                        size={"small"}
                                    >
                                        <ToggleButton value={20}>
                                            20
                                        </ToggleButton>
                                        <ToggleButton value={100}>
                                            100
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Tooltip>
                            </Box>
                        </ListItem>
                    </List>
                </form>
                <Box display={"flex"} m={2} mt={1}>
                    <LinkButton
                        href={Routes.oldMyAllianceDecks}
                        size={"small"}
                        newWindow={true}>
                        Old Alliance Decks
                    </LinkButton>
                </Box>
            </KeyDrawer>
        )
    }
}
