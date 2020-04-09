import { Link, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"

export const OwnersList = (props: { owners?: string[] }) => {

    const owners = props.owners
    if (!owners || owners.length === 0) {
        return null
    }

    return (
        <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(1)}}>
            <Typography variant={"subtitle2"} style={{marginRight: spacing(1)}}>
                Owned by:
            </Typography>
            {owners.map(owner => {
                return (
                        <Link variant={"body2"} style={{marginRight: spacing(1)}} href={Routes.decksForUserOnMyTeam(owner)} key={owner}>
                            {owner}
                        </Link>
                )
            })}
        </div>
    )
}
