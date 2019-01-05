import * as React from "react"
import { Link, LinkProps } from "react-router-dom"

export const UnstyledLink = (props: LinkProps & { style?: React.CSSProperties }) => {
    const {style, ...rest} = props
    return <Link style={{textDecoration: "none", ...style}} {...rest} />
}
