import * as React from "react"
import WorseArrow from "../imgs/chevron-down.svg"
import BetterArrow from "../imgs/chevron-up.svg"
import WorstArrow from "../imgs/double-chevron-down.svg"
import BestArrow from "../imgs/double-chevron-up.svg"

export enum ArrowQuality {
    BEST,
    BETTER,
    WORSE,
    WORST
}

export const ArrowQualityIcon = (props: { arrowQuality: ArrowQuality, width?: number, style?: React.CSSProperties }) => {
    let icon
    switch (props.arrowQuality) {
        case ArrowQuality.BEST:
            icon = BestArrow
            break;
        case ArrowQuality.BETTER:
            icon = BetterArrow
            break;
        case ArrowQuality.WORSE:
            icon = WorseArrow
            break;
        case ArrowQuality.WORST:
            icon = WorstArrow
            break;
    }
    return (
        <img alt={"Arrow Quality"} src={icon} style={{width: props.width ? props.width : 24, ...props.style}}/>
    )
}
