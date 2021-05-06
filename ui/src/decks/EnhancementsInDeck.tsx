import * as React from "react"
import { EnhancementType } from "../cards/EnhancementType"
import { ExtendedExpansionUtils } from "../expansions/ExtendedExpansionUtils"
import EnhancedAmber from "../generic/imgs/enhancements/enhanced-aember.png"
import EnhancedCapture from "../generic/imgs/enhancements/enhanced-capture.png"
import EnhancedDamage from "../generic/imgs/enhancements/enhanced-damage.png"
import EnhancedDraw from "../generic/imgs/enhancements/enhanced-draw.png"
import { LargeValueIconsRow } from "../generic/LargeValueIcon"
import { DeckSearchResult, DeckUtils } from "./models/DeckSearchResult"


export const EnhancementsInDeck = (props: { deck: DeckSearchResult, style?: React.CSSProperties }) => {

    const {deck, style} = props

    if (!ExtendedExpansionUtils.allowsEnhancements(deck.expansion)) {
        return null
    }

    const bonusIcons = DeckUtils.calculateBonusIcons(deck)

    if (bonusIcons == null) {
        return null
    }

    return (
        <LargeValueIconsRow
            values={[
                {value: bonusIcons.get(EnhancementType.AEMBER)!, iconSrc: EnhancedAmber},
                {value: bonusIcons.get(EnhancementType.CAPTURE)!, iconSrc: EnhancedCapture},
                {value: bonusIcons.get(EnhancementType.DAMAGE)!, iconSrc: EnhancedDamage},
                {value: bonusIcons.get(EnhancementType.DRAW)!, iconSrc: EnhancedDraw},
            ]}
            style={style}
        />
    )
}
