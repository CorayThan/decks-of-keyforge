import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    IconButtonProps,
    Link,
    ListItem,
    ListItemText
} from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import { ListItemProps } from "@material-ui/core/ListItem"
import * as React from "react"
import { useState } from "react"
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
                <Box display={"flex"} alignItems={"center"}>
                    {icon ? <div style={{marginRight: spacing(1)}}>{icon}</div> : null}
                    <ListItemText primary={primary}/>
                </Box>
            </Link>
        </ListItem>
    )
}

export const LinkButtonSafe = (props: ButtonProps & {noCaps?: boolean}) => {
    const {href, onClick, style, noCaps, ...rest} = props
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button
                {...rest}
                onClick={(event) => {
                    setOpen(true)
                    if (onClick) {
                        onClick(event)
                    }
                }}
                style={{textTransform: noCaps ? "none" : undefined, ...style}}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Head through the wormhole?</DialogTitle>
                <DialogContent>
                    <Box display={"flex"} justifyContent={"center"} mb={2}>
                        <img width={200} src={"https://dok-imgs.s3-us-west-2.amazonaws.com/wild-wormhole.jpg"} alt={"wild wormhole"}/>
                    </Box>
                    <DialogContentText gutterBottom={true}>
                        Click this link to leave DoK
                    </DialogContentText>
                    <Link
                        href={href}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        onClick={() => setOpen(false)}
                    >
                        {href}
                    </Link>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
