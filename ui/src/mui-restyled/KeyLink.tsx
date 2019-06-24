import { Link } from "@material-ui/core"
import * as React from "react"
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom"

export const KeyLink = (props: { disabled?: boolean, noStyle?: boolean } & RouterLinkProps) => {
    const {disabled, noStyle, style, ...rest} = props
    if (disabled) {
        return <div>{props.children}</div>
    }
    // @ts-ignore
    return <Link style={{textDecoration: noStyle ? "none" : undefined, color: undefined, ...style}} {...rest} color={"inherit"} component={RouterLink} />
}
