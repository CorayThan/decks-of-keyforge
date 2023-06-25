import { SynTraitValue } from "../../generated-src/SynTraitValue"
import { TraitBuilderStore } from "./TraitBuilderStore"
import React, { useEffect } from "react"
import { Box, Button, Dialog, DialogActions } from "@material-ui/core"
import { TraitBuildStage } from "./TraitBuildStage"
import IconButton from "@material-ui/core/IconButton/IconButton"
import { NavigateBefore, NavigateNext } from "@material-ui/icons"
import { SynOrTrait } from "./SynBuilderTypes"
import { spacing } from "../../config/MuiConfig"
import { observer } from "mobx-react"
import { SelectTraitOrSyn } from "./SelectTraitOrSyn"
import { TraitStrengthSelect } from "./TraitStrengthSelect"
import { TraitTargetsSelect } from "./TraitTargetsSelect"
import { TraitExtraSelect } from "./TraitExtraSelect"
import { SynergyTrait } from "../../generated-src/SynergyTrait"
import { CardSynergySelect } from "./CardSynergySelect"

interface AddTraitProps {
    editTrait?: {
        type: SynOrTrait,
        trait: SynTraitValue
    }
    add: (type: SynOrTrait, trait: SynTraitValue) => void
    existingSynergies: SynTraitValue[]
    store: TraitBuilderStore
}

export const TraitOrSynBuilder = observer((props: AddTraitProps) => {
    const {editTrait, add, existingSynergies, store} = props

    useEffect(() => {
        if (editTrait != null) {
            store.openDialog(editTrait)
        }
    }, [editTrait])

    return (
        <Box>
            <Button
                style={{marginRight: spacing(2)}}
                variant={"contained"}
                color={"secondary"}
                onClick={() => {
                    store.traitOrSynergy = "trait"
                    store.openDialog()
                }}
            >
                Add Trait
            </Button>
            <Button
                style={{marginRight: spacing(2)}}
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                    store.traitOrSynergy = "synergy"
                    store.openDialog()
                }}
            >
                Add Synergy
            </Button>
            <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                    store.traitOrSynergy = "synergy"
                    store.openDialog()
                    store.trait = SynergyTrait.card
                }}
            >
                Add Card Synergy
            </Button>
            <Dialog
                open={store.open}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        store.close()
                    }
                }}
                aria-labelledby="form-dialog-title"
            >
                <TraitBuildStageSwitcher store={store} add={add} existingSynergies={existingSynergies}/>
            </Dialog>
        </Box>
    )
})

const TraitBuildStageSwitcher = observer((props: {
    store: TraitBuilderStore,
    add: (type: SynOrTrait, trait: SynTraitValue) => void
    existingSynergies: SynTraitValue[]
}) => {
    const {store, add, existingSynergies} = props

    let contents

    if (store.trait === SynergyTrait.card) {
        contents = (<CardSynergySelect store={store} existingSynergies={existingSynergies}/>)
    } else {
        switch (store.buildStage) {
            case TraitBuildStage.SELECT_TRAIT:
                contents = (<SelectTraitOrSyn store={store}/>)
                break
            case TraitBuildStage.SELECT_STRENGTH:
                contents = (<TraitStrengthSelect store={store}/>)
                break
            case TraitBuildStage.SELECT_TARGETS:
                contents = (<TraitTargetsSelect store={store}/>)
                break
            case TraitBuildStage.EXTRA_VALUES:
                contents = (<TraitExtraSelect store={store} existingSynergies={existingSynergies}/>)
                break
        }
    }

    return (
        <>
            {contents}
            <DialogActions>
                <Button onClick={store.close}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        add(store.traitOrSynergy, store.synTraitValue())
                        store.close()
                    }}
                    color={"primary"}
                    disabled={!store.valid()}
                >
                    Add {store.traitOrSynergy}
                </Button>
                {store.trait !== SynergyTrait.card && (
                    <>
                        <IconButton
                            disabled={store.buildStage === TraitBuildStage.SELECT_TRAIT}
                            onClick={() => store.buildStage = (store.buildStage - 1)}
                        >
                            <NavigateBefore/>
                        </IconButton>
                        <IconButton
                            disabled={store.buildStage === TraitBuildStage.EXTRA_VALUES || store.trait == null}
                            onClick={store.navigateToNextPage}
                        >
                            <NavigateNext/>
                        </IconButton>
                    </>
                )}
            </DialogActions>
        </>
    )
})
