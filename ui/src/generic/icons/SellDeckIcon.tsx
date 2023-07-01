import * as React from "react"
import SellDeck from "../imgs/sell-deck-icon.svg"
import SellDeckWhite from "../imgs/sell-deck-icon-white.svg"

export const SellDeckIcon = (props: { white?: boolean, height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={props.white ? SellDeckWhite : SellDeck} style={{height: props.height ? props.height : 24, ...props.style}}/>
    )
}
