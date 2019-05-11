import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface GraySidebarProps {
    width: number
    vertical?: boolean
    style?: React.CSSProperties
    children?: React.ReactNode
}

export class GraySidebar extends React.Component<GraySidebarProps> {
    render() {
        const {width, vertical, style, ...rest} = this.props
        return (
            <div
                style={{
                    backgroundColor: "#DFDFDF",
                    display: "flex",
                    flexDirection: vertical ? "column" : undefined,
                    width,
                    margin: spacing(1),
                    borderRadius: "20px",
                    ...style
                }}
                {...rest}
            />
        )
    }
}
