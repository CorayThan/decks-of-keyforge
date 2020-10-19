import { Card, Typography } from "@material-ui/core"
import React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"

export const PleaseBecomeAPatron = () => {
    return (
        <Card
            style={{
                margin: spacing(4),
                padding: spacing(2),
                backgroundColor: themeStore.lightBlueBackground,
                maxWidth: 800
            }}
        >
            <Typography variant={"h4"}>
                Become a Patron and Reap the Benefits!
            </Typography>
            <Typography variant={"subtitle2"} style={{marginTop: spacing(2)}}>
                Get the most out of your collection
            </Typography>
            <Typography variant={"body2"} style={{marginTop: spacing(1)}}>

            </Typography>
            <Typography variant={"body2"} style={{marginTop: spacing(1)}}>
                This will also seriously hinder deck evaluation, second hand sales online, and online play.
            </Typography>
        </Card>
    )
}
