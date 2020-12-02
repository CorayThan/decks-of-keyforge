import * as React from "react"
import Mutant from "../imgs/mutant-icon.svg"

export const MutantIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Mutant} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
