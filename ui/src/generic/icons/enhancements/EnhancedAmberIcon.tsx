import * as React from "react"
import EnhancedAmber from "../../imgs/enhancements/enhanced-aember.png"

export const EnhancedAmberIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Enhanced Amber"} src={EnhancedAmber} style={{height: props.width ? props.width : 16, ...props.style}}/>
    )
}
