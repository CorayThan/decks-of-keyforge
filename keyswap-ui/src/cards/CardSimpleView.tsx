import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Card } from "./Card"

export const CardSimpleView = (props: {card: Card}) => {
    return (
        <img src={props.card.frontImage} style={{width: 200, margin: spacing(2)}} />
    )
}
