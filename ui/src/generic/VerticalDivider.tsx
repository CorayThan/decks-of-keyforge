import React from "react"

export const VerticalDivider = (props: {style?: React.CSSProperties}) => {
    return (
        <div style={{display: "flex", flexDirection: "column", ...props.style}}>
            <div style={{flexGrow: 1, width: 1, backgroundColor: "rgba(0, 0, 0, 0.12)"}}/>
        </div>
    )
}