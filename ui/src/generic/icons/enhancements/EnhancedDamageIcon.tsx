import * as React from "react"
import EnhancedDamage from "../../imgs/enhancements/enhanced-damage.png"

export const EnhancedDamageIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Enhanced Capture"} src={EnhancedDamage} style={{height: props.width ? props.width : 16, ...props.style}}/>
    )
}
