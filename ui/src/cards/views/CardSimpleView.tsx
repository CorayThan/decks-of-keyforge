import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { SimpleCard } from "../../generated-src/SimpleCard"
import { UnstyledLink } from "../../generic/UnstyledLink"
import { findCardImageUrl } from "../KCard"

interface CardSimpleViewProps {
    card: SimpleCard
    size?: number
    style?: React.CSSProperties
    noLink?: boolean
}

export const CardSimpleView = (props: CardSimpleViewProps) => {
    if (props.card == null) {
        return null
    }
    const width = props.size ? props.size : 300
    const contents = (
        <img
            alt={props.card.cardTitle}
            src={findCardImageUrl(props.card.cardTitleUrl)}
            style={{width, height: (width * 420) / 300, margin: spacing(2), ...props.style}}
        />
    )
    if (props.noLink) {
        return contents
    }
    return (
        <UnstyledLink
            to={Routes.cardPage(props.card.cardTitle)}
        >
            {contents}
        </UnstyledLink>
    )
}
