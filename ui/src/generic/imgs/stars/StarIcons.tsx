import * as React from "react"
import GoldStar from "./gold-star.svg"
import GrayHalfStar from "./gray-half-star.svg"
import GrayStar from "./gray-star.svg"
import HalfStar from "./half-star.svg"
import Star from "./star.svg"

export enum StarType {
    NORMAL,
    HALF,
    GOLD,
    GRAY
}

export const StarIcon = (props: { starType: StarType, small?: boolean, gray?: boolean, style?: React.CSSProperties }) => {
    let height = props.small ? 12 : 16
    let starSrc = Star
    if (props.starType === StarType.HALF) {
        starSrc = props.gray ? GrayHalfStar : HalfStar
        height = height / 2
    } else if (props.starType === StarType.GOLD) {
        starSrc = GoldStar
    } else if (props.gray) {
        starSrc = GrayStar
    }
    return (
        <img alt={"Star"} src={starSrc} style={{height, width: props.small ? 12.6 : 16.8, ...props.style}}/>
    )
}
