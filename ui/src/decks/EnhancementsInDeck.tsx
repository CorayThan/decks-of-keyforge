import * as React from "react"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { ExtendedExpansionUtils } from "../expansions/ExtendedExpansionUtils"
import EnhancedAmber from "../generic/imgs/enhancements/enhanced-aember.png"
import EnhancedCapture from "../generic/imgs/enhancements/enhanced-capture.png"
import EnhancedDamage from "../generic/imgs/enhancements/enhanced-damage.png"
import EnhancedDraw from "../generic/imgs/enhancements/enhanced-draw.png"
import { LargeValueIconsRow } from "../generic/LargeValueIcon"
import { DeckSearchResult } from "./models/DeckSearchResult"


export const EnhancementsInDeck = (props: { deck: DeckSearchResult }) => {

    const {deck} = props

    if (!ExtendedExpansionUtils.allowsEnhancements(deck.expansion)) {
        return null
    }

    let enhancedAmber = 0
    let enhancedCapture = 0
    let enhancedDamage = 0
    let enhancedDraw = 0


    const cards = deck.housesAndCards
        .flatMap(house => house.cards.map(simpleCard => cardStore.fullCardFromCardName(simpleCard.cardTitle)))
        .filter(card => card != null) as KCard[]


    cards.forEach(card => {
        enhancedAmber += card.extraCardInfo.enhancementAmber
        enhancedCapture += card.extraCardInfo.enhancementCapture
        enhancedDamage += card.extraCardInfo.enhancementDamage
        enhancedDraw += card.extraCardInfo.enhancementDraw
    })

    return (
        <LargeValueIconsRow
            values={[
                {value: enhancedAmber, iconSrc: EnhancedAmber},
                {value: enhancedCapture, iconSrc: EnhancedCapture},
                {value: enhancedDamage, iconSrc: EnhancedDamage},
                {value: enhancedDraw, iconSrc: EnhancedDraw},
            ]}
        />
    )
}