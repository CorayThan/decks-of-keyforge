import * as React from "react"
import Upgrade from "./upgrade.svg"

export const UpgradeIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Upgrade} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
