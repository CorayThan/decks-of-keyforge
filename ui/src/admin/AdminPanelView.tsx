import { Box, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { spacing } from "../config/MuiConfig"
import { KeyCard } from "../generic/KeyCard"
import { KeyButton } from "../mui-restyled/KeyButton"
import { WhiteSpaceTypography } from "../mui-restyled/WhiteSpaceTypography"
import { uiStore } from "../ui/UiStore"
import { adminStore } from "./AdminStore"

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
                <Box p={2}>
                    <KeyButton
                        variant={"contained"}
                        color={"secondary"}
                        onClick={adminStore.reloadCards}
                        loading={adminStore.reloadingCards}
                    >
                        Reload Cards
                    </KeyButton>
                </Box>
                <Box pt={0} p={2}>
                    <KeyButton
                        variant={"contained"}
                        color={"secondary"}
                        onClick={adminStore.publishNewSas}
                        loading={adminStore.publishingSas}
                    >
                        Publish New SAS Version
                    </KeyButton>
                </Box>
                <Box pt={0} p={2}>
                    <KeyButton
                        variant={"contained"}
                        color={"secondary"}
                        onClick={adminStore.startNewStats}
                        loading={adminStore.startingStats}
                    >
                        Start New Stats
                    </KeyButton>
                </Box>
                <Box pt={0} p={2}>
                    <WhiteSpaceTypography>{adminStore.info}</WhiteSpaceTypography>
                </Box>
            </KeyCard>
        </Box>
    )
})
