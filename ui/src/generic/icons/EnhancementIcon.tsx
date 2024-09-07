import * as React from "react"
import { EnhancementType } from "../../cards/EnhancementType"
import EnhancedAmber from "../imgs/enhancements/enhanced-aember.png"
import EnhancedCapture from "../imgs/enhancements/enhanced-capture.png"
import EnhancedDamage from "../imgs/enhancements/enhanced-damage.png"
import EnhancedDraw from "../imgs/enhancements/enhanced-draw.png"
import EnhancedDiscard from "../imgs/enhancements/enhanced-discard.png"
import EnhancedBrobnar from "../../houses/imgs/brobnar.png"
import EnhancedDis from "../../houses/imgs/dis.png"
import EnhancedEkwidon from "../../houses/imgs/ekwidon.png"
import EnhancedGeistoid from "../../houses/imgs/geistoid.png"
import EnhancedLogos from "../../houses/imgs/logos.png"
import EnhancedMars from "../../houses/imgs/mars.png"
import EnhancedSkyborn from "../../houses/imgs/skyborn.png"

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
    } else if (props.type === EnhancementType.BROBNAR) {
        iconSrc = EnhancedBrobnar
    } else if (props.type === EnhancementType.DIS) {
        iconSrc = EnhancedDis
    } else if (props.type === EnhancementType.EKWIDON) {
        iconSrc = EnhancedEkwidon
    } else if (props.type === EnhancementType.GEISTOID) {
        iconSrc = EnhancedGeistoid
    } else if (props.type === EnhancementType.LOGOS) {
        iconSrc = EnhancedLogos
    } else if (props.type === EnhancementType.MARS) {
        iconSrc = EnhancedMars
    } else if (props.type === EnhancementType.SKYBORN) {
        iconSrc = EnhancedSkyborn
    } else {
        throw new Error(`No enhancement icon for ${props.type}`)
    }

    return (
        <img alt={props.type} src={iconSrc} style={{width: 16, height: 16}}/>
    )
}
