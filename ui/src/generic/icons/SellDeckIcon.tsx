import * as React from "react"
import SellDeck from "../imgs/sell-deck-icon.svg"

export const SellDeckIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={SellDeck} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
