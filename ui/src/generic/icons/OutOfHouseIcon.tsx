import * as React from "react"
import OutOfHouse from "../imgs/out-of-house.svg"

export const OutOfHouseIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img alt={"Out of House"} src={OutOfHouse} style={{height: props.height ? props.height : 30, ...props.style}}/>
    )
}
