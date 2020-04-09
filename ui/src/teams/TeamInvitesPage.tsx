import { Button, Grid, List, ListItem, Paper, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { HelperText } from "../generic/CustomTypographies"
import { BecomeAPatron } from "../thirdpartysites/patreon/BecomeAPatron"
import { PatreonRewardsTier } from "../thirdpartysites/patreon/PatreonRewardsTier"
import { userStore } from "../user/UserStore"
import { TeamInviteInfo } from "./TeamOrInvites"
import { teamStore } from "./TeamStore"

class CreateTeamStore {

    private readonly teamNameRegex = /^[a-zA-Z0-9\s',-]+$/

    @observable
    name = ""

    cleanName = () => this.name.trim()

    valid = () => {
        const nameTrimmed = this.cleanName()
        if (nameTrimmed.length === 0) return false
        if (nameTrimmed.length > 60) return false
        if (!this.teamNameRegex.test(nameTrimmed)) return false

        return true
    }
}

export const TeamInvitesPage = observer((props: { invites: TeamInviteInfo[] }) => {
    const canFormTeam = userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.SUPPORT_SOPHISTICATION)

    const [createTeamStore] = useState(new CreateTeamStore())

    return (
        <div>
            <Grid container={true} spacing={4}>
                <Grid item={true} sm={12} md={6}>
                    <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>Invites to Teams</Typography>
                    <Paper style={{padding: spacing(2)}}>
                        {props.invites.length > 0 && (
                            <>
                                <Typography variant={"subtitle1"}>You've been invited!</Typography>
                                <List>
                                    {props.invites.map(invite => (
                                        <ListItem key={invite.teamId}>
                                            <Typography style={{marginRight: spacing(2)}}>
                                                By: "{invite.teamName}"
                                            </Typography>
                                            <Button
                                                variant={"contained"}
                                                onClick={() => teamStore.joinTeam(invite.teamId, invite.teamName)}
                                                color={"primary"}
                                            >
                                                Join
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                        <HelperText>
                            An invite will show up when your team leader creates one for you. Ask them to invite '{userStore.username}'.
                        </HelperText>
                    </Paper>
                </Grid>
                <Grid item={true} sm={12} md={6}>
                    <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>Form a Team</Typography>
                    <Paper style={{padding: spacing(2)}}>
                        {canFormTeam ? (
                            <div style={{display: "flex", alignItems: "top"}}>
                                <TextField
                                    label={"Team Name"}
                                    variant={"outlined"}
                                    value={createTeamStore.name}
                                    onChange={(event) => createTeamStore.name = event.target.value}
                                    fullWidth={true}
                                    helperText={"60 or fewer characters. Letters, numbers, spaces, apostrophes, commas and hyphens only."}
                                />
                                <div>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        style={{marginLeft: spacing(2), width: 136}}
                                        onClick={() => teamStore.formOrUpdate(createTeamStore.cleanName())}
                                        disabled={!createTeamStore.valid()}
                                    >
                                        Create Team
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <BecomeAPatron>
                                Become a $5 a month patron to form a team!
                            </BecomeAPatron>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
})