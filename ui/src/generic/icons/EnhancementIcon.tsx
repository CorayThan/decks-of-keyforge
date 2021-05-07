import * as React from "react"
import { EnhancementType } from "../../cards/EnhancementType"
import EnhancedAmber from "../imgs/enhancements/enhanced-aember.png"
import EnhancedCapture from "../imgs/enhancements/enhanced-capture.png"
import EnhancedDamage from "../imgs/enhancements/enhanced-damage.png"
import EnhancedDraw from "../imgs/enhancements/enhanced-draw.png"

export const EnhancementIcon = (props: { type: EnhancementType }) => {
    let iconSrc

    if (props.type === EnhancementType.AEMBER) {
        iconSrc = EnhancedAmber
    } else if (props.type === EnhancementType.CAPTURE) {
        iconSrc = EnhancedCapture
    } else if (props.type === EnhancementType.DAMAGE) {
        iconSrc = EnhancedDamage
    } else {
        iconSrc = EnhancedDraw
    }

    return (
        <img alt={props.type} src={iconSrc} style={{width: 16, height: 16}}/>
    )
}
