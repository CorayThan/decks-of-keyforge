import { observer } from "mobx-react"
import { TraitBuilderStore } from "./TraitBuilderStore"
import { synergyAndTraitGroups, SynTraitDisplayGroup } from "../SynergyTrait"
import { Box, Button, DialogContent, DialogTitle } from "@material-ui/core"
import { Utils } from "../../config/Utils"
import { grey } from "@material-ui/core/colors"
import Typography from "@material-ui/core/Typography/Typography"
import React from "react"
import { TraitBubble } from "../../synergy/TraitBubble"
import { HelperText } from "../../generic/CustomTypographies"

const replaceRs = (convert: string) => {
    return convert.replace(/_ R_/g, " ??? ")
}

export const SelectTraitOrSyn = observer((props: { store: TraitBuilderStore }) => {
    const store = props.store
    return (
        <>
            <DialogTitle id="form-dialog-title">Add {Utils.camelCaseToTitleCase(store.traitOrSynergy)}</DialogTitle>
            <DialogContent>
                {store.trait != null && (
                    <Box display={"flex"} mb={1}>
                        <TraitBubble
                            traitValue={store.synTraitValue()}
                            trait={store.traitOrSynergy === "trait"}
                        />
                    </Box>
                )}
                <Box width={480} height={400}>
                    {synergyAndTraitGroups
                        .filter(traitGroup => store.traitOrSynergy === "synergy" || !traitGroup.synergyOnly)
                        .map(traitGroup => (
                            <DiplayTraitSelectGroup traitGroup={traitGroup} store={store} key={traitGroup.groupName}/>
                        ))}
                </Box>
            </DialogContent>
        </>
    )
})

export const DiplayTraitSelectGroup = (props: { store: TraitBuilderStore, traitGroup: SynTraitDisplayGroup }) => {
    const {store, traitGroup} = props
    return (
        <Box mb={1} p={1} style={{backgroundColor: grey["100"], borderRadius: 8}}>
            <Typography
                variant={"subtitle2"}
                style={{fontWeight: "bold"}}
                color={"textPrimary"}>
                {traitGroup.groupName}
            </Typography>
            {traitGroup.description && (
                <HelperText>
                    {traitGroup.description}
                </HelperText>
            )}
            <Box mt={1} display={"flex"} flexWrap={"wrap"} gridGap={8}>
                {traitGroup.traits
                    .map(trait => (
                        <Button
                            variant={"outlined"}
                            size={"small"}
                            key={trait}
                            color={trait === store.trait ? "primary" : undefined}
                            onClick={() => {
                                store.trait = trait
                                store.navigateToNextPage()
                            }}
                        >
                            {replaceRs(Utils.camelCaseToTitleCase(trait))}
                        </Button>
                    ))}
            </Box>
        </Box>
    )
}
