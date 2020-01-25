import { ClickAwayListener, Divider, Tooltip, Typography, withStyles } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { spacing } from "../config/MuiConfig"
import { screenStore } from "../ui/ScreenStore"

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

@observer
export class SasTip extends React.Component<SasTipProps> {

    @observable
    open = false

    handleTooltipOpen = () => {
        this.open = true
    }

    handleTooltipClose = () => {
        this.open = false
    }

    render() {
        const {title, contents, children, items} = this.props
        const smallVersion = screenStore.screenSizeXs()

        const titleComponent = (
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
        )

        if (!smallVersion) {
            return (
                <SasTipInner
                    enterTouchDelay={1000}
                    leaveTouchDelay={20000}
                    title={titleComponent}
                >
                    <div
                        style={{userSelect: "none"}}
                    >
                        {children}
                    </div>
                </SasTipInner>
            )
        }

        return (
            <ClickAwayListener onClickAway={this.handleTooltipClose}>
                <SasTipInner
                    PopperProps={{
                        disablePortal: true,
                    }}
                    onClose={this.handleTooltipClose}
                    open={this.open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={titleComponent}
                >
                    <div
                        style={{userSelect: "none"}}
                        onClick={this.handleTooltipOpen}
                    >
                        {children}
                    </div>
                </SasTipInner>
            </ClickAwayListener>
        )
    }
}
