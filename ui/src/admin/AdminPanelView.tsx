import { Box, TextField, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { spacing } from "../config/MuiConfig"
import { KeyCard } from "../generic/KeyCard"
import { KeyButton } from "../mui-restyled/KeyButton"
import { WhiteSpaceTypography } from "../mui-restyled/WhiteSpaceTypography"
import { uiStore } from "../ui/UiStore"
import { adminStore } from "./AdminStore"
import { patreonStore } from "../thirdpartysites/patreon/PatreonStore"
import { DokLink } from "../generic/DokLink"

export const AdminPanelView = observer(() => {

    useEffect(() => {
        adminStore.findStatsInfo()
        uiStore.setTopbarValues("Admin Panel", "Admin", "")
    }, [])

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <KeyCard
                topContents={(
                    <Typography style={{color: "#FFFFFF"}} variant={"h4"}>
                        Admin Stuff
                    </Typography>
                )}
                style={{margin: spacing(2)}}
            >
                <Box display={"flex"} padding={2} flexDirection={"column"} alignItems={"start"}
                     style={{gap: spacing(2)}}>
                    <DokLink target={"_blank"} href={"https://www.patreon.com/portal/registration/register-clients"}>Get
                        Patreon Refresh Token</DokLink>
                    <Box width={520}>
                        <TextField
                            fullWidth={true}
                            label={"patreon refresh token"}
                            variant={"outlined"}
                            value={patreonStore.refreshToken}
                            onChange={(event) => patreonStore.refreshToken = event.target.value}
                        />
                    </Box>
                    <KeyButton
                        variant={"outlined"}
                        color={"primary"}
                        onClick={patreonStore.refreshPrimaryAccount}
                        loading={patreonStore.refreshingPrimaryPatreon}
                        disabled={patreonStore.refreshToken.trim().length < 1}
                    >
                        Refresh Primary Patreon Account
                    </KeyButton>
                    <KeyButton
                        variant={"outlined"}
                        color={"primary"}
                        onClick={adminStore.reloadCards}
                        loading={adminStore.reloadingCards}
                    >
                        Reload Cards
                    </KeyButton>
                    <KeyButton
                        variant={"outlined"}
                        color={"primary"}
                        onClick={adminStore.startNewStats}
                        loading={adminStore.startingStats}
                    >
                        Start New Stats
                    </KeyButton>
                    <KeyButton
                        variant={"contained"}
                        color={"secondary"}
                        onClick={adminStore.publishNewSas}
                        loading={adminStore.publishingSas}
                    >
                        Publish New SAS Version
                    </KeyButton>
                    <WhiteSpaceTypography>{adminStore.info}</WhiteSpaceTypography>
                </Box>
            </KeyCard>
        </Box>
    )
})
