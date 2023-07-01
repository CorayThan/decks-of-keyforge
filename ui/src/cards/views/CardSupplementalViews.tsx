import { KCard } from "../KCard"
import { ExpansionUtils } from "../../generated-src/Expansion"
import { ExpansionIcon } from "../../expansions/ExpansionIcon"
import { spacing } from "../../config/MuiConfig"
import { SynTraitValue } from "../../generated-src/SynTraitValue"
import { TraitBubble } from "../../synergy/TraitBubble"
import * as React from "react"

export const CardSetsFromCard = (props: { card: KCard, noDot?: boolean }) => {
    const sets = ExpansionUtils.sort(props.card.cardNumbers?.map(cardNumber => cardNumber.expansion) ?? [])
    return (
        <div style={{display: "flex"}}>
            {sets.map((backendExpansion) => (
                <ExpansionIcon size={16} expansion={backendExpansion} key={backendExpansion}
                               style={{marginLeft: spacing(1)}}/>
            ))}
        </div>
    )
}

export const CardTraits = (props: { traits: SynTraitValue[] }) => (
    <div style={{display: "flex", flexWrap: "wrap"}}>
        {props.traits.map(synergy => (
            <TraitBubble
                key={synergy.id}
                traitValue={synergy}
                trait={true}
            />
        ))}
    </div>
)

export const CardSynergies = (props: { synergies: SynTraitValue[] }) => (
    <div style={{display: "flex", flexWrap: "wrap"}}>
        {props.synergies.map(synergy => (
            <TraitBubble
                key={synergy.id}
                traitValue={synergy}
            />
        ))}
    </div>
)
