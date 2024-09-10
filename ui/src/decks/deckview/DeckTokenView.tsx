import * as React from "react"

export const deckTopTokenWidth = 88

interface DeckTokenViewProps {
    tokenNameUrl: string
    width?: number
}

export const DeckTokenView = (props: DeckTokenViewProps) => {
    const {tokenNameUrl, width} = props
    const realWidth = width ?? deckTopTokenWidth
    return (
        <img
            alt={tokenNameUrl}
            src={tokenNameUrl}
            style={{width: realWidth, height: (realWidth * 420) / 300}}
        />
    )
}
