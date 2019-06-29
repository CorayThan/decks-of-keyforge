import * as React from "react"
import TradeDeck from "../imgs/trade-deck-icon.svg"

export const TradeDeckIcon = (props: {height?: number, style?: React.CSSProperties}) => (
    <img alt={"Trade Deck"} src={TradeDeck} style={{height: props.height ? props.height : 24, ...props.style}}/>
)
