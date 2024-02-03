import * as React from "react"
import { EnhancementType } from "../../cards/EnhancementType"
import EnhancedAmber from "../imgs/enhancements/enhanced-aember.png"
import EnhancedCapture from "../imgs/enhancements/enhanced-capture.png"
import EnhancedDamage from "../imgs/enhancements/enhanced-damage.png"
import EnhancedDraw from "../imgs/enhancements/enhanced-draw.png"
import EnhancedDiscard from "../imgs/enhancements/enhanced-discard.png"

export const EnhancementIcon = (props: { type: EnhancementType }) => {
    let iconSrc

    if (props.type === EnhancementType.AEMBER) {
        iconSrc = EnhancedAmber
    } else if (props.type === EnhancementType.CAPTURE) {
        iconSrc = EnhancedCapture
    } else if (props.type === EnhancementType.DAMAGE) {
        iconSrc = EnhancedDamage
    } else if (props.type === EnhancementType.DRAW) {
        iconSrc = EnhancedDraw
    } else if (props.type === EnhancementType.DISCARD) {
        iconSrc = EnhancedDiscard
    } else {
        throw new Error(`No enhancement icon for ${props.type}`)
    }

    return (
        <img alt={props.type} src={iconSrc} style={{width: 16, height: 16}}/>
    )
}
