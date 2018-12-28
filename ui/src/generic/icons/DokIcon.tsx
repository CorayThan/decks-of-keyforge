import * as React from "react"
import dok from "../imgs/dok.svg"

export const DokIcon = (props: {height?: number, style?: React.CSSProperties}) => (
    <img src={dok} style={{height: props.height, ...props.style}}/>
)
