import * as React from "react"
import { memo } from "react"
import { SearchDrawerExpansionPanel } from "../../../components/SearchDrawerExpansionPanel"
import { ConstraintDropdowns, FiltersConstraintsStore } from "../ConstraintDropdowns"

interface DeckSearchDrawerConstraintsProps {
    store: FiltersConstraintsStore
    forSale: boolean
    forTrade: boolean
}

export const DeckSearchDrawerConstraints = memo((props: DeckSearchDrawerConstraintsProps) => {
    const {store, forSale, forTrade} = props

    const constraintOptions = [
        "amberControl",
        "expectedAmber",
        "artifactControl",
        "creatureControl",
        "efficiency",
        "disruption",
        "effectivePower",
        "bonusAmber",
        "bonusCapture",
        "bonusDraw",
        "aercScore",
        "synergyRating",
        "antisynergyRating",
        "sasRating",
        "creatureCount",
        "actionCount",
        "artifactCount",
        "upgradeCount",
        "powerLevel",
        "chains",
        "maverickCount",
    ]
    const hideMinMaxConstraintOptions = [
        "listedWithinDays"
    ]

    if (forSale) {
        constraintOptions.unshift("buyItNow")
    }
    if (forSale || forTrade) {
        constraintOptions.unshift("listedWithinDays")
    }

    return (
        <SearchDrawerExpansionPanel
            initiallyOpen={!store.isDefaultConstraints()}
            title={"Constraints"}
        >
            <ConstraintDropdowns
                store={store}
                properties={constraintOptions}
                hideMinMax={hideMinMaxConstraintOptions}
            />
        </SearchDrawerExpansionPanel>
    )
})
