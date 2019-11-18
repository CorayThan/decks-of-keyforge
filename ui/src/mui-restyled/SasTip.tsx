import { Divider, Tooltip, Typography, withStyles } from "@material-ui/core"
import React from "react"
import { spacing } from "../config/MuiConfig"

export interface SasTipProps {
    title: React.ReactNode
    contents?: React.ReactNode
    items?: string[]
    children: React.ReactNode
}

const SasTipInner = withStyles(() => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 320,
        border: "1px solid #dadde9"
    },
}))(Tooltip)

export class SasTip extends React.Component<SasTipProps> {
    render() {
        const {title, contents, children, items} = this.props
        return (
            <SasTipInner
                enterTouchDelay={1}
                leaveTouchDelay={100000}
                title={
                    <React.Fragment>
                        {title}
                        {(contents || items) && (
                            <Divider style={{marginBottom: spacing(1)}}/>
                        )}
                        {contents}
                        {items && items.map(item => (
                            <Typography
                                key={item}
                            >
                                {item}
                            </Typography>
                        ))}
                    </React.Fragment>
                }
            >
                <div>
                    {children}
                </div>
            </SasTipInner>
        )
    }
}
