import { Card, Link, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { spacing, themeStore } from "./config/MuiConfig"

export const ChangeOrgNotice = observer(() => {
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
                Petition to add bonus icons to Master Vault
            </Typography>
            <Typography variant={"h6"} style={{marginTop: spacing(2)}}>
                Thanks for your help!
            </Typography>
            <Typography style={{marginTop: spacing(1)}}>
                We got to over 1,000 signatures! I've relayed the petition to a contact at FFG and they are aware of the issue.
                I'll be taking this banner down from DoK soon.
            </Typography>
            <Typography variant={"subtitle2"} style={{marginTop: spacing(2)}}>
                The Issue
            </Typography>
            <Typography variant={"body2"} style={{marginTop: spacing(1)}}>
                We can't see which cards are modified with what bonus icons. This
                prevents deck content verification, opening up a dangerous avenue for
                cheating in competitive KeyForge.
            </Typography>
            <Typography variant={"body2"} style={{marginTop: spacing(1)}}>
                This will also seriously hinder deck evaluation, second hand sales online, and online play.
            </Typography>
            <Typography variant={"subtitle2"} style={{marginTop: spacing(2)}}>
                How can I help?
            </Typography>
            <Typography variant={"body2"} style={{marginTop: spacing(1)}}>
                <Link href={"https://www.change.org/keyforge-bonus-icons"} target={"_blank"}>Sign the petition!</Link> We've
                created this petition to request Fantasy Flight Games add these to Master Vault as soon as possible.
                We'll submit it to FFG once we have a good number of signatures.
            </Typography>
        </Card>
    )
})
