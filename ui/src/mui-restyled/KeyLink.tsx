import { Link, LinkProps } from "@material-ui/core"
import * as React from "react"
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom"

export const KeyLink = (props: { disabled?: boolean, noStyle?: boolean, newWindow?: boolean } & RouterLinkProps) => {
    const {disabled, noStyle, newWindow, style, ...rest} = props
    if (disabled) {
        return <div>{props.children}</div>
    }
    return (
        <Link
            // @ts-ignore
            style={{textDecoration: noStyle ? "none" : undefined, color: undefined, ...style}}
            {...rest}
            color={"inherit"}
            component={RouterLink}
            target={newWindow ? "_blank" : undefined}
            rel={newWindow ? "noopener noreferrer" : undefined}
        />
    )
}

export const LinkNewWindow = (props: LinkProps) => {
    return (
        <Link
            rel={"noopener noreferrer"}
            target={"_blank"}
            {...props}
        />
    )
}
