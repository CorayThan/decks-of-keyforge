import { Button, IconButton, IconButtonProps, Link, ListItem, ListItemText } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import { ListItemProps } from "@material-ui/core/ListItem"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export const LinkButton = (props: ButtonProps & { newWindow?: boolean }) => {
    const {href, newWindow, style, ...rest} = props
    if (href == null) {
        return null
    }
    return (
        // @ts-ignore
        <Button
            {...rest}
            href={href}
            target={newWindow ? "_blank" : undefined}
            rel={newWindow ? "noopener noreferrer" : undefined}
            component={"a"}
            style={{whiteSpace: "nowrap", ...style}}
        />
    )
}

export const LinkIconButton = (props: IconButtonProps & { href: string, newWindow?: boolean }) => {
    const {href, newWindow, style, ...rest} = props
    return (
        // @ts-ignore
        <IconButton
            {...rest}
            href={href}
            target={newWindow ? "_blank" : undefined}
            rel={newWindow ? "noopener noreferrer" : undefined}
            component={"a"}
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
            <Link href={to} underline={"none"} noWrap={true} color={"inherit"}>
                {icon ? <div style={{marginRight: spacing(2)}}>{icon}</div> : null}
                <ListItemText primary={primary}/>
            </Link>
        </ListItem>
    )
}
