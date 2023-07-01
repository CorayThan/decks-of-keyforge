import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { UserLink } from "../user/UserLink"
import { Box } from "@material-ui/core"

export const OwnersList = (props: { owners?: string[] }) => {

    const owners = props.owners
    if (!owners || owners.length === 0) {
        return null
    }

    return (
        <Box>
            <Box display={"flex"} flexWrap={"wrap"} style={{gap: spacing(1)}}>
                {owners.map(owner => {
                    return (
                        <UserLink key={owner} username={owner}/>
                    )
                })}
            </Box>
        </Box>
    )
}
