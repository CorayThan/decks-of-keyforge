import * as React from "react"
import { memo } from "react"
import { SearchDrawerExpansionPanel } from "../../../components/SearchDrawerExpansionPanel"
import { ConstraintDropdowns, FiltersConstraintsStore } from "../ConstraintDropdowns"

interface DeckSearchDrawerConstraintsProps {
    store: FiltersConstraintsStore
}

export const DeckSearchDrawerConstraints = memo((props: DeckSearchDrawerConstraintsProps) => {
    const {store} = props

    const constraintOptions = [
        "amberControl",
        "expectedAmber",
        "artifactControl",
        "creatureControl",
        "efficiency",
        "recursion",
        "disruption",
        "effectivePower",
        "bonusAmber",
        "bonusCapture",
        "bonusDraw",
        "sasRating",
        "creatureCount",
        "actionCount",
        "artifactCount",
        "upgradeCount",
        "maverickCount",
    ]

    return (
        <SearchDrawerExpansionPanel
            initiallyOpen={!store.isDefaultConstraints()}
            title={"Constraints"}
        >
            <ConstraintDropdowns
                store={store}
                properties={constraintOptions}
            />
        </SearchDrawerExpansionPanel>
    )
})
