import { Box, Paper } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { themeStore } from "../config/MuiConfig"

export const AnnouncementPaper = observer((props: { children: React.ReactNode, maxWidth?: number, style?: React.CSSProperties }) => {
    const {children, maxWidth, style} = props
    return (
        <Paper
            style={{backgroundColor: themeStore.lightBlueBackground, maxWidth, ...style}}
        >
            <Box p={2}>
                {children}
            </Box>
        </Paper>
    )
})