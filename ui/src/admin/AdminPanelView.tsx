import { Box, Typography } from "@material-ui/core"
import React, { useEffect } from "react"
import { spacing } from "../config/MuiConfig"
import { KeyCard } from "../generic/KeyCard"
import { KeyButton } from "../mui-restyled/KeyButton"
import { uiStore } from "../ui/UiStore"
import { adminStore } from "./AdminStore"

export const AdminPanelView = () => {

    useEffect(() => {
        uiStore.setTopbarValues("Admin Panel", "Admin", "")
    }, [])

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <KeyCard
                topContents={(
                    <Typography style={{color: "#FFFFFF"}} variant={"h4"}>
                        Admin Controls
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
            </KeyCard>
        </Box>
    )
}
