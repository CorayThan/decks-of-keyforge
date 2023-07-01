import * as React from "react"
import TradeDeck from "../imgs/trade-deck-icon.svg"
import TradeDeckWhite from "../imgs/trade-deck-icon-white.svg"

export const TradeDeckIcon = (props: {white?: boolean, height?: number, style?: React.CSSProperties}) => (
    <img alt={"Trade Deck"} src={props.white ? TradeDeckWhite : TradeDeck} style={{height: props.height ? props.height : 24, ...props.style}}/>
)
