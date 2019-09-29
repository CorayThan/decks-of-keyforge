import { Button, ListItem, ListItemText } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import { ListItemProps } from "@material-ui/core/ListItem"
import * as React from "react"
import { Link, LinkProps } from "react-router-dom"
import { spacing } from "../config/MuiConfig"

export class LinkButton extends React.Component<ButtonProps & Partial<LinkProps>> {
    render() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <Button component={this.props.to != null ? Link as any : undefined} {...this.props}/>
    }
}

interface ListItemLinkProps extends ListItemProps {
    icon?: React.ReactElement
    primary: string
    to: string
}

export const ListItemLink = (props: ListItemLinkProps) => {
    const {icon, primary, to, ...rest} = props


    const renderLink = React.useMemo(
        () =>
            React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
                (itemProps, ref) => (
                    // With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
                    // See https://github.com/ReactTraining/react-router/issues/6056
                    <Link to={to} {...itemProps} innerRef={ref}/>
                ),
            ),
        [to],
    )

    return (
        // @ts-ignore
        <ListItem button={true} component={renderLink} {...rest}>
            {icon ? <div style={{marginRight: spacing(2)}}>{icon}</div> : null}
            <ListItemText primary={primary}/>
        </ListItem>
    )
}
