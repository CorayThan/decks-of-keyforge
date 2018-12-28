import * as React from "react"

export const ToolbarSpacer = () => <div style={{
    "minHeight": 56,
    "@media (minWidth:0px) and (orientation: landscape)": {
        minHeight: 48
    },
    "@media (minWidth:600px)": {
        minHeight: 64
    }
}}/>
