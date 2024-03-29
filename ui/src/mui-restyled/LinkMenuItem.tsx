import { MenuItem } from "@material-ui/core"
import * as React from "react"
import { Link, LinkProps } from "react-router-dom"

export const LinkMenuItem = (props: LinkProps) => {
    return (
        // @ts-ignore
        <MenuItem
            component={Link}
            {...props}
        />
    )
}
