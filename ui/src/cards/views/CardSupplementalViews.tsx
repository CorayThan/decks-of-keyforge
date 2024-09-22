import {Expansion, ExpansionUtils} from "../../generated-src/Expansion"
import {ExpansionIcon} from "../../expansions/ExpansionIcon"
import {spacing} from "../../config/MuiConfig"
import {SynTraitValue} from "../../generated-src/SynTraitValue"
import {TraitBubble} from "../../synergy/TraitBubble"
import * as React from "react"
import {FrontendCard} from "../../generated-src/FrontendCard"
import {Box} from "@material-ui/core";

export const CardSetsFromCard = (props: { card: FrontendCard, noDot?: boolean }) => {
    let sets = ExpansionUtils.sort(props.card.cardNumbers?.map(cardNumber => cardNumber.expansion) ?? [])
    if (sets.includes(Expansion.VAULT_MASTERS_2023)) {
        sets = sets.filter(expansion => expansion !== Expansion.VAULT_MASTERS_2024)
    }
    return (
        <Box
            display={"flex"}
            flexWrap={"wrap"}
            gridGap={spacing(1)}
            justifyContent={"flex-end"}
        >
            {sets.map((backendExpansion) => (
                <ExpansionIcon
                    key={backendExpansion}
                    size={16}
                    expansion={backendExpansion}
                />
            ))}
        </Box>
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
