import * as React from "react"
import { EnhancementType } from "../../cards/EnhancementType"
import EnhancedAmber from "../imgs/enhancements/enhanced-aember.png"
import EnhancedCapture from "../imgs/enhancements/enhanced-capture.png"
import EnhancedDamage from "../imgs/enhancements/enhanced-damage.png"
import EnhancedDraw from "../imgs/enhancements/enhanced-draw.png"
import EnhancedDiscard from "../imgs/enhancements/enhanced-discard.png"
import EnhancedBrobnar from "../imgs/enhancements/brobnar.svg"
import EnhancedDis from "../imgs/enhancements/dis.svg"
import EnhancedEkwidon from "../imgs/enhancements/ekwidon.svg"
import EnhancedGeistoid from "../imgs/enhancements/geistoid.svg"
import EnhancedLogos from "../imgs/enhancements/logos.svg"
import EnhancedMars from "../imgs/enhancements/mars.svg"
import EnhancedSkyborn from "../imgs/enhancements/skyborn.svg"

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
