import * as React from "react"
import AuctionDeck from "../imgs/auction.svg"
import AuctionDeckWhite from "../imgs/auction-white.svg"

export const AuctionDeckIcon = (props: {white?: boolean, height?: number, style?: React.CSSProperties}) => (
    <img alt={"Auction"} src={props.white ? AuctionDeckWhite : AuctionDeck} style={{height: props.height ? props.height : 24, ...props.style}}/>
)
