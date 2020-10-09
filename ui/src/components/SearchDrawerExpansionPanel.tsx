import { Collapse, Divider, Typography } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
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

@observer
export class SearchDrawerExpansionPanel extends React.Component<SearchDrawerExpansionPanelProps> {

    @observable
    open = false

    constructor(props: SearchDrawerExpansionPanelProps) {
        super(props)
        this.open = props.initiallyOpen
    }

    render() {
        const {title, onClick, children} = this.props
        return (
            <div style={{flexGrow: 1}}>
                <Divider/>
                <div
                    style={{display: "flex", alignItems: "center", cursor: "pointer", marginTop: spacing(1), marginBottom: spacing(1)}}
                    onClick={() => {
                        if (onClick) {
                            onClick()
                        }
                        this.open = !this.open
                    }}
                >
                    <Typography variant={"subtitle1"} color={"textSecondary"} style={{flexGrow: 1}}>{title}</Typography>
                    <ExpandMore style={rotateIconStyle(this.open)}/>
                </div>
                <Collapse in={this.open} style={{marginBottom: this.open ? spacing(1) : 0}}>
                    {children}
                </Collapse>
            </div>
        )
    }
}

export const rotateIconStyle = (rotatedUp: boolean): React.CSSProperties => {
    return {
        transform: `rotate(${rotatedUp ? 0 : 180}deg)`,
        transition: theme.transitions.create("transform", transition)
    }
}
