import * as React from "react"
import { Link, LinkProps } from "react-router-dom"
import { HashLink, HashLinkProps } from "react-router-hash-link"

export class UnstyledLink extends React.Component<LinkProps & { style?: React.CSSProperties }> {
    render() {
        const {style, ...rest} = this.props
        return <Link style={{textDecoration: "none", ...style}} {...rest} />
    }
}

export const UnstyledHashLink = (props: HashLinkProps & { style?: React.CSSProperties }) => {
    const {style, ...rest} = props
    return <HashLink style={{color: "rgba(0, 0, 0, 0.87)", textDecoration: "none", ...style}} {...rest} />
}
