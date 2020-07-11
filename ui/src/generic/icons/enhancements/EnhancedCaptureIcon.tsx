import * as React from "react"
import EnhancedCapture from "../../imgs/enhancements/enhanced-capture.png"

export const EnhancedCaptureIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Enhanced Capture"} src={EnhancedCapture} style={{height: props.width ? props.width : 16, ...props.style}}/>
    )
}
