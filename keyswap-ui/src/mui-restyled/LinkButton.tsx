import { Button } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import * as React from "react"
import { Link, LinkProps } from "react-router-dom"

export const LinkButton = (props: ButtonProps & LinkProps) => {
    // @ts-ignore: no-implicit-any
    const Linky = linkyProps => <Link {...linkyProps} />
    return <Button component={Linky} {...props} />
}
