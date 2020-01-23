import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../config/MuiConfig"

interface GraySidebarProps {
    width: number
    vertical?: boolean
    style?: React.CSSProperties
    children?: React.ReactNode
}

@observer
export class GraySidebar extends React.Component<GraySidebarProps> {
    render() {
        const {width, vertical, style, ...rest} = this.props
        return (
            <div
                style={{
                    backgroundColor: themeStore.aercViewBackground,
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
