import {
    Box,
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
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { MyDokSubPaths, Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { DeckFilters } from "../decks/search/DeckFilters"
import { TeamInfo } from "../generated-src/TeamInfo"
import { UserSearchResult } from "../generated-src/UserSearchResult"
import { HelperText } from "../generic/CustomTypographies"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { LinkButton } from "../mui-restyled/LinkButton"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { TeamIcon } from "./TeamIcon"
import { TeamStore, teamStore } from "./TeamStore"
import { UploadTeamImage } from "./UploadTeamImage"
import { EventValue } from "../generic/EventValue"
import IconButton from "@material-ui/core/IconButton/IconButton"
import axios from "axios"
import { Check, Edit } from "@material-ui/icons"

class TeamManagementStore {
    @observable
    username = ""

    @observable
    homepage = ""

    @observable
    manageTeam = false

    @observable
    leaveTeamOpen = false

    @observable
    editTeamName = false

    @observable
    teamName = ""

    cleanName = () => this.username.trim()

    valid = () => {
        const nameTrimmed = this.cleanName()
        return nameTrimmed.length !== 0;
    }

    constructor(initialHomepage: string, initialTeamName: string) {
        makeObservable(this)
        this.homepage = initialHomepage
        this.teamName = initialTeamName
    }

    saveTeamName = async () => {
        const name = this.teamName.trim()
        this.editTeamName = false
        await axios.post(`${TeamStore.SECURE_CONTEXT}/team-name/${name}`)
        teamStore.findTeamInfo()
    }
}

const memberTableHeaders = (isLeader: boolean, leaderUsername: string, store: TeamManagementStore): SortableTableHeaderInfo<UserSearchResult>[] => {
    const defaultHeaders: SortableTableHeaderInfo<UserSearchResult>[] = [
        {
            property: "username",
            transform: (user) => <Link href={Routes.decksForUserOnMyTeam(user.username)}>{user.username}</Link>,
            sortFunction: (user) => user.username.toLowerCase()
        },
        {property: "deckCount"},
        {property: "topSasAverage"},
        {property: "highSas"},
        {property: "lowSas"},
        {property: "totalPower"},
        {property: "totalChains"},
        {property: "mavericks"},
        {property: "anomalies"},
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
    const {name, leader, invites, members, teamImg, homepage} = props.team

    const [teamManagementStore] = useState(new TeamManagementStore(homepage ?? "", name))

    const isLeader = leader === userStore.username

    const teamDeckFilters = new DeckFilters()
    teamDeckFilters.teamDecks = true

    return (
        <div>
            <div style={{display: "flex", marginBottom: spacing(4), alignItems: "center"}}>
                {teamManagementStore.editTeamName ? (
                    <Box width={320}>
                        <TextField
                            label={"team name"}
                            value={teamManagementStore.teamName}
                            onChange={(event: EventValue) => teamManagementStore.teamName = event.target.value}
                            fullWidth={true}
                            variant={"outlined"}
                        />
                    </Box>
                ) : (
                    <Typography variant={"h4"}>{name}</Typography>
                )}
                {isLeader ? (
                    <>
                        <IconButton
                            style={{marginLeft: spacing(2)}}
                            onClick={() => {
                                if (teamManagementStore.editTeamName) {
                                    // save
                                    teamManagementStore.saveTeamName()
                                } else {
                                    teamManagementStore.editTeamName = true
                                }
                            }}
                        >
                            {teamManagementStore.editTeamName ? <Check/> : <Edit/>}
                        </IconButton>
                        <UploadTeamImage
                            teamImg={teamImg}
                            style={{marginLeft: spacing(2)}}
                        />
                    </>
                ) : (
                    <TeamIcon size={36} teamImg={teamImg} style={{marginLeft: spacing(4)}}/>
                )}
                <LinkButton
                    variant={"outlined"}
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
                    <Grid item={true} xs={12} md={6} lg={4}>

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
                    <Grid item={true} xs={12} md={6} lg={4}>

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
                    <Grid item={true} xs={12} lg={4}>
                        <Paper style={{padding: spacing(2)}}>
                            <Box display={"flex"} alignItems={"top"}>
                                <TextField
                                    value={teamManagementStore.homepage}
                                    onChange={event => teamManagementStore.homepage = event.target.value}
                                    label={"Team Homepage"}
                                    variant={"outlined"}
                                    fullWidth={true}
                                    helperText={"Your team's URL homepage."}
                                    error={teamManagementStore.homepage != "" && !Utils.validateUrl(teamManagementStore.homepage)}
                                />
                                <Box ml={2}>
                                    <Button
                                        disabled={teamManagementStore.homepage === homepage || (teamManagementStore.homepage != "" && !Utils.validateUrl(teamManagementStore.homepage))}
                                        onClick={async () => {
                                            await teamStore.updateHomepage(teamManagementStore.homepage)
                                            await teamStore.findTeamInfo()
                                            messageStore.setSuccessMessage("Updated team homepage!")
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
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
                    defaultSort={"deckCount"}
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
