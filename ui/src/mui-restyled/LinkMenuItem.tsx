import { MenuItem } from "@material-ui/core"
import { MenuItemProps } from "@material-ui/core/MenuItem"
import * as React from "react"
import { Link, LinkProps } from "react-router-dom"

export const LinkMenuItem = (props: MenuItemProps & LinkProps) => {
    return (
        <Link {...props} style={{ textDecoration: "none", outline: "none"}}>
            <MenuItem {...props} />
        </Link>
    )
}
