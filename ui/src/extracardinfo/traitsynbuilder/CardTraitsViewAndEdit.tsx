import { SynTraitValue } from "../../generated-src/SynTraitValue"
import { observer } from "mobx-react"
import { Grid, IconButton } from "@material-ui/core"
import { spacing, themeStore } from "../../config/MuiConfig"
import { TraitBubble } from "../../synergy/TraitBubble"
import { Delete, Edit } from "@material-ui/icons"
import { TraitOrSynBuilder } from "./TraitOrSynBuilder"
import { SynOrTrait } from "./SynBuilderTypes"
import React, { useState } from "react"
import { TraitBuilderStore } from "./TraitBuilderStore"

interface CardTraitsViewAndEditProps {
    traits: SynTraitValue[]
    synergies: SynTraitValue[]
}

export const CardTraitsViewAndEdit = observer((props: CardTraitsViewAndEditProps) => {

    const {traits, synergies} = props
    const [store] = useState(new TraitBuilderStore())

    return (
        <Grid container={true} spacing={2}
              style={{backgroundColor: themeStore.aercViewBackground, marginBottom: spacing(2)}}>
            <Grid item={true} xs={12} sm={6}>
                <div>
                    {traits.map((synergy, idx) => (
                        <div
                            key={idx}
                            style={{display: "flex"}}
                        >
                            <TraitBubble
                                traitValue={synergy}
                                trait={true}
                            />
                            <IconButton
                                onClick={() => traits.splice(idx, 1)}
                            >
                                <Delete/>
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    const toEdit = traits[idx]
                                    store.openDialog({
                                        type: "trait",
                                        trait: toEdit
                                    })
                                    traits.splice(idx, 1)
                                }}
                            >
                                <Edit/>
                            </IconButton>
                        </div>
                    ))}
                </div>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
                <div>
                    {synergies.map((synergy, idx) => (
                        <div
                            key={idx}
                            style={{display: "flex"}}
                        >
                            <TraitBubble
                                traitValue={synergy}
                            />
                            <IconButton
                                onClick={() => synergies.splice(idx, 1)}
                            >
                                <Delete/>
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    const toEdit = synergies[idx]
                                    store.openDialog({
                                        type: "synergy",
                                        trait: toEdit
                                    })
                                    synergies.splice(idx, 1)
                                }}
                            >
                                <Edit/>
                            </IconButton>
                        </div>
                    ))}
                </div>
            </Grid>
            <Grid item={true} xs={12}>
                <TraitOrSynBuilder
                    store={store}
                    add={(type: SynOrTrait, trait: SynTraitValue) => {
                        if (type === "synergy") {
                            synergies.push(trait)
                        } else {
                            traits.push(trait)
                        }
                    }}
                    existingSynergies={synergies}
                />
            </Grid>
        </Grid>
    )
})
