import { TraitBuilderStore } from "./TraitBuilderStore"
import {
    Box,
    Checkbox,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    TextField
} from "@material-ui/core"
import { Utils } from "../../config/Utils"
import { TraitBubble } from "../../synergy/TraitBubble"
import React, { ChangeEvent } from "react"
import { observer } from "mobx-react"
import { Autocomplete } from "@material-ui/lab"
import { cardStore } from "../../cards/CardStore"
import { spacing } from "../../config/MuiConfig"
import { SynTraitValue } from "../../generated-src/SynTraitValue"
import { SynergyGroupSelect } from "./SynergyGroupSelect"

export const TraitExtraSelect = observer((props: { store: TraitBuilderStore, existingSynergies: SynTraitValue[] }) => {
    const {store, existingSynergies} = props

    return (
        <>
            <DialogTitle
                id="form-dialog-title">Select {Utils.camelCaseToTitleCase(store.traitOrSynergy)} Other
                Values</DialogTitle>
            <DialogContent>
                <Box display={"flex"} mb={1}>
                    <TraitBubble
                        traitValue={store.synTraitValue()}
                        trait={store.traitOrSynergy === "trait"}
                    />
                </Box>

                <TextField
                    label={"Creature Power Range"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={store.powersString}
                    placeholder={"odd, even, 2-5, 2 or less, 3+, 3,5,7"}
                    onChange={(event) => store.powersString = event.target.value}
                    fullWidth={true}
                    style={{marginTop: spacing(1)}}
                />
                {store.traitOrSynergy === "synergy" ? (
                    <FormHelperText>e.g. The Spirit's Way has an antisynergy with 3+ power creatures</FormHelperText>
                ) : (
                    <FormHelperText>e.g. Onyx Knight has the trait Destroys Creatures Odd.</FormHelperText>
                )}

                <Box display={"flex"} justifyContent={"center"} mt={1} mb={0.5}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={store.notCardTraits}
                                onChange={() => store.notCardTraits = !store.notCardTraits}
                            />
                        }
                        label="Non"
                    />
                    <Autocomplete
                        multiple={true}
                        // @ts-ignore
                        options={cardStore.cardTraits}
                        value={store.cardTraits}
                        renderInput={(params) => <TextField {...params} label={"Card Traits"}/>}
                        onChange={(event: ChangeEvent<{}>, newValue: string[] | null) => {
                            store.cardTraits = newValue ?? []
                        }}
                        size={"small"}
                        fullWidth={true}
                        style={{marginLeft: spacing(1)}}
                    />
                </Box>
                {store.traitOrSynergy === "synergy" ? (
                    <FormHelperText>e.g. Vault's Blessing has a synergy with mutant creatures.</FormHelperText>
                ) : (
                    <FormHelperText>
                        e.g. Dark Æmber Vault has a trait increasing the power of mutant creatures.
                    </FormHelperText>
                )}

                {store.traitOrSynergy === "synergy" && (
                    <SynergyGroupSelect store={store} existingSynergies={existingSynergies}/>
                )}

            </DialogContent>
        </>
    )
})

