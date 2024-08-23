import * as React from "react"
import { Link, LinkProps } from "react-router-dom"

export class UnstyledLink extends React.Component<LinkProps & { style?: React.CSSProperties }> {
    render() {
        const {style, ...rest} = this.props
        return <Link style={{textDecoration: "none", ...style}} {...rest} />
    }
}
