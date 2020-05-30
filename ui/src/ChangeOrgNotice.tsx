import { Card, Link, Typography } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { observer } from "mobx-react"
import React from "react"
import { spacing, themeStore } from "./config/MuiConfig"

export const ChangeOrgNotice = observer(() => {
    return (
        <Card
            style={{
                margin: spacing(4),
                padding: spacing(2),
                backgroundColor: themeStore.darkMode ? blue["800"] : blue["50"],
                maxWidth: 800
            }}
        >
            <Typography variant={"h4"}>
                Petition to add bonus icons to Master Vault!
            </Typography>
            <Typography variant={"h6"} style={{marginTop: spacing(2)}}>
                The Issue
            </Typography>
            <Typography style={{marginTop: spacing(1)}}>
                We can't see which cards are modified with what bonus icons. This
                prevents deck content verification, opening up a dangerous avenue for
                cheating in competitive KeyForge.
            </Typography>
            <Typography style={{marginTop: spacing(1)}}>
                This will also seriously hinder deck evaluation, second hand sales online, and online play.
            </Typography>
            <Typography variant={"h6"} style={{marginTop: spacing(2)}}>
                How can I help?
            </Typography>
            <Typography style={{marginTop: spacing(1)}}>
                <Link href={"https://www.change.org/keyforge-bonus-icons"} target={"_blank"}>Sign the petition!</Link> We've
                created this petition to request Fantasy Flight Games add these to Master Vault as soon as possible.
                We'll submit it to FFG once we have a good number of signatures.
            </Typography>
        </Card>
    )
})
