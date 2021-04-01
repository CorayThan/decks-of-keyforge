import { Box, Button } from "@material-ui/core"
import * as React from "react"
import { spacing } from "./config/MuiConfig"
import { AboutSubPaths } from "./config/Routes"
import Fear from "./generic/imgs/fear.png"

export const FearPage = () => {
    return (
        <Box
            style={{
                backgroundImage: `url(${Fear})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100vw",
                height: "100vh",
            }}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"flex-end"}
        >
            <Button color={"primary"} href={AboutSubPaths.releaseNotes} variant={"contained"} size={"large"} style={{marginBottom: spacing(4)}}>
                Release Notes
            </Button>
        </Box>
    )
}