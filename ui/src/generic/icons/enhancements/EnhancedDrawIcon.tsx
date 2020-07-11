import * as React from "react"
import EnhancedDraw from "../../imgs/enhancements/enhanced-draw.png"

export const EnhancedDrawIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Enhanced Draw"} src={EnhancedDraw} style={{height: props.width ? props.width : 16, ...props.style}}/>
    )
}
