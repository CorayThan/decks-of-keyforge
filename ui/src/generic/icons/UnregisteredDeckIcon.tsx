import * as React from "react"
import unregisteredDeck from "../imgs/unregistered-deck.svg"

export const UnregisteredDeckIcon = (props: { height?: number, style?: React.CSSProperties }) => (
    <img src={unregisteredDeck} style={{height: props.height ? props.height : 24, ...props.style}}/>
)
