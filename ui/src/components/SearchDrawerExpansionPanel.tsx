import { Collapse, Divider, Typography } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import React, { useState } from "react"
import { spacing, theme } from "../config/MuiConfig"

interface SearchDrawerExpansionPanelProps {
    initiallyOpen: boolean
    title: string
    onClick?: () => void
    children: React.ReactNode
}

const transition = {
    duration: theme.transitions.duration.shortest
}

export const SearchDrawerExpansionPanel = (props: SearchDrawerExpansionPanelProps) => {
    const {title, onClick, children, initiallyOpen} = props

    const [open, setOpen] = useState(initiallyOpen)

    return (
        <div style={{flexGrow: 1}}>
            <Divider/>
            <div
                style={{display: "flex", alignItems: "center", cursor: "pointer", marginTop: spacing(1), marginBottom: spacing(1)}}
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                    setOpen(!open)
                }}
            >
                <Typography variant={"subtitle1"} color={"textSecondary"} style={{flexGrow: 1}}>{title}</Typography>
                <ExpandMore style={rotateIconStyle(open)}/>
            </div>
            <Collapse in={open} style={{marginBottom: open ? spacing(1) : 0}}>
                {children}
            </Collapse>
        </div>
    )
}


export const rotateIconStyle = (rotatedUp: boolean): React.CSSProperties => {
    return {
        transform: `rotate(${rotatedUp ? 0 : 180}deg)`,
        transition: theme.transitions.create("transform", transition)
    }
}
