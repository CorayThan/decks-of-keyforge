import * as React from "react"
import Creature from "../imgs/swordman.svg"

export const CreatureIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Creature} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
