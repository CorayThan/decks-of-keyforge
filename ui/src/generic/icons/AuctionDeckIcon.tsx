import * as React from "react"
import AuctionDeck from "../imgs/auction.svg"

export const AuctionDeckIcon = (props: {height?: number, style?: React.CSSProperties}) => (
    <img alt={"Auction"} src={AuctionDeck} style={{height: props.height ? props.height : 24, ...props.style}}/>
)
