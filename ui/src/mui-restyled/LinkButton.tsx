import { Button, Link, ListItem, ListItemText } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import { ListItemProps } from "@material-ui/core/ListItem"
import * as React from "react"
import { Link as RRLink } from "react-router-dom"
import { spacing } from "../config/MuiConfig"

export const LinkButton = (props: ButtonProps & { newWindow?: boolean }) => {
    const {href, newWindow, style, ...rest} = props
    return (
        <Button
            {...rest}
            // @ts-ignore
            to={href}
            target={newWindow ? "_blank" : undefined}
            rel={newWindow ? "noopener noreferrer" : undefined}
            component={RRLink}
            style={{whiteSpace: "nowrap", ...style}}
        />
    )
}

interface ListItemLinkProps extends ListItemProps {
    icon?: React.ReactElement
    primary: string
    to: string
}

export const ListItemLink = (props: ListItemLinkProps) => {
    const {icon, primary, to, ...rest} = props

    return (
        // @ts-ignore
        <ListItem
            {...rest}
        >
            <Link href={to} underline={"none"} noWrap={true}>
                {icon ? <div style={{marginRight: spacing(2)}}>{icon}</div> : null}
                <ListItemText primary={primary}/>
            </Link>
        </ListItem>
    )
}
