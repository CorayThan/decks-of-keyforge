import * as React from "react"
import { findCardImageUrl } from "../../cards/KCard"

export const deckTopTokenWidth = 88

interface DeckTokenViewProps {
    tokenName: string
    width?: number
}

export const DeckTokenView = (props: DeckTokenViewProps) => {
    const {tokenName, width} = props
    const realWidth = width ?? deckTopTokenWidth
    return (
        <img
            alt={tokenName}
            src={findCardImageUrl({cardTitle: tokenName})}
            style={{width: realWidth, height: (realWidth * 420) / 300}}
        />
    )
}
