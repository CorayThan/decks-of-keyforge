import * as React from "react"
import { Link, LinkProps } from "react-router-dom"

export const KeyLink = (props: { disabled?: boolean, noStyle?: boolean } & LinkProps) => {
    const {disabled, noStyle, style, ...rest} = props
    if (disabled) {
        return <div>{props.children}</div>
    }
    return <Link style={{textDecoration: noStyle ? "none" : undefined, ...style}} {...rest} />
}
