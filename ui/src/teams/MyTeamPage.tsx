import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControlLabel,
    Grid,
    Link,
    List,
    ListItem,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { MyDokSubPaths, Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { TeamInfo } from "../generated-src/TeamInfo"
import { UserSearchResult } from "../generated-src/UserSearchResult"
import { HelperText } from "../generic/CustomTypographies"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { LinkButton } from "../mui-restyled/LinkButton"
import { userStore } from "../user/UserStore"
import { teamStore } from "./TeamStore"

class TeamManagementStore {

    @observable
    username = ""

    @observable
    manageTeam = false

    @observable
    leaveTeamOpen = false

    cleanName = () => this.username.trim()

    valid = () => {
        const nameTrimmed = this.cleanName()
        if (nameTrimmed.length === 0) return false

        return true
    }
}

const memberTableHeaders = (isLeader: boolean, leaderUsername: string, store: TeamManagementStore): SortableTableHeaderInfo<UserSearchResult>[] => {
    const defaultHeaders: SortableTableHeaderInfo<UserSearchResult>[] = [
        {
            property: "username",
            sortable: true,
            transform: (user) => <Link href={Routes.decksForUserOnMyTeam(user.username)}>{user.username}</Link>
        },
        {property: "deckCount", sortable: true},
        {property: "topSasAverage", sortable: true},
        {property: "highSas", sortable: true},
        {property: "lowSas", sortable: true},
        {property: "totalPower", sortable: true},
        {property: "totalChains", sortable: true},
        {property: "mavericks", sortable: true},
        {property: "anomalies", sortable: true},
    ]

    if (isLeader) {
        defaultHeaders.push({
            transform: (user) => {
                if (user.username === leaderUsername || !store.manageTeam) {
                    return null
                }
                return (
                    <div>
                        <Button
                            onClick={() => teamStore.removeFromTeam(user.username)}
                        >
                            Kick
                        </Button>
                    </div>
                )
            }
        })
    }

    return defaultHeaders
}

export const MyTeamPage = observer((props: { team: TeamInfo }) => {
    const {name, leader, invites, members} = props.team

    const [teamManagementStore] = useState(new TeamManagementStore())

    const isLeader = leader === userStore.username

    const teamDeckFilters = new DeckFilters()
    teamDeckFilters.teamDecks = true

    return (
        <div>
            <div style={{display: "flex", marginBottom: spacing(4)}}>
                <Typography variant={"h4"}>{name}</Typography>
                <LinkButton
                    variant={"outlined"}
                    color={"primary"}
                    href={Routes.deckSearch(teamDeckFilters)}
                    style={{marginLeft: spacing(4)}}
                >
                    Team Decks
                </LinkButton>
                <div style={{flexGrow: 1}}/>
                {isLeader ? (
                    <Tooltip title={"To disband your team first remove all members except yourself."}>
                        <div>
                            <Button
                                onClick={() => teamStore.disbandTeam()}
                                disabled={members.length > 1}
                            >
                                Disband
                            </Button>
                        </div>
                    </Tooltip>
                ) : (
                    <Button
                        onClick={() => teamManagementStore.leaveTeamOpen = true}
                    >
                        Leave Team
                    </Button>
                )}
            </div>
            {isLeader && (
                <Grid container={true} spacing={4}>
                    <Grid item={true} sm={12} md={6}>

                        <Paper style={{padding: spacing(2)}}>
                            <div style={{display: "flex", alignItems: "top"}}>
                                <TextField
                                    label={"Invite DoK user with username"}
                                    variant={"outlined"}
                                    value={teamManagementStore.username}
                                    onChange={(event) => teamManagementStore.username = event.target.value}
                                    fullWidth={true}
                                />
                                <div>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        style={{marginLeft: spacing(2), width: 120}}
                                        onClick={() => {
                                            teamStore.inviteToTeam(teamManagementStore.cleanName())
                                            teamManagementStore.username = ""
                                        }}
                                        disabled={!teamManagementStore.valid()}
                                    >
                                        Invite
                                    </Button>
                                </div>
                            </div>
                            <HelperText style={{marginTop: spacing(2)}}>
                                After sending an invite, users can join your team
                                from <Link href={MyDokSubPaths.team}>this link</Link>.
                            </HelperText>
                        </Paper>
                    </Grid>
                    <Grid item={true} sm={12} md={6}>

                        <Paper style={{padding: spacing(2)}}>
                            <Typography variant={"h6"} style={{marginBottom: spacing(2)}}>Active invites</Typography>
                            {invites.length > 0 ? (
                                <List>
                                    {invites.map(invite => (
                                        <ListItem key={invite}>
                                            <Link
                                                href={Routes.decksForUser(invite)}
                                                variant={"body1"}
                                                style={{marginRight: spacing(1), width: 160}}
                                            >
                                                {invite}
                                            </Link>
                                            <Button
                                                onClick={() => teamStore.removeInvite(invite)}
                                            >
                                                Remove
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography>Invite a new member to see open invites!</Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            )}
            <Paper style={{marginTop: spacing(4)}}>
                <div style={{display: "flex", padding: spacing(2)}}>
                    <Typography variant={"h6"}>Members</Typography>
                    <div style={{flexGrow: 1}}/>
                    {isLeader && (
                        <FormControlLabel
                            label={"Manage Members"}
                            control={(
                                <Checkbox
                                    value={teamManagementStore.manageTeam}
                                    onChange={event => teamManagementStore.manageTeam = event.target.checked}
                                />
                            )}
                        />
                    )}
                </div>
                <SortableTable
                    headers={memberTableHeaders(isLeader, leader, teamManagementStore)}
                    data={members}
                    defaultSort={"username"}
                />
            </Paper>

            <Dialog
                open={teamManagementStore.leaveTeamOpen}
                onClose={() => teamManagementStore.leaveTeamOpen = false}
            >
                <DialogTitle>Really leave?</DialogTitle>
                <DialogActions>
                    <Button
                        onClick={() => teamManagementStore.leaveTeamOpen = false}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            teamStore.leaveTeam()
                            teamManagementStore.leaveTeamOpen = false
                        }}
                    >
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})
