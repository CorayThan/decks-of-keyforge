import { observer } from "mobx-react"
import { TraitBuilderStore } from "./TraitBuilderStore"
import { synergyAndTraitGroups, SynTraitDisplayGroup } from "../SynergyTraitUtils"
import { Box, Button, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import { Utils } from "../../config/Utils"
import { grey } from "@material-ui/core/colors"
import Typography from "@material-ui/core/Typography/Typography"
import React, { useState } from "react"
import { TraitBubble } from "../../synergy/TraitBubble"
import { HelperText } from "../../generic/CustomTypographies"
import { themeStore } from "../../config/MuiConfig"
import { screenStore } from "../../ui/ScreenStore"

const replaceRsAndConvertToTitleCase = (convert: string) => {
    return Utils.camelCaseToTitleCase(convert).replace(/_ R_/g, " ??? ")
}

export const SelectTraitOrSyn = observer((props: { store: TraitBuilderStore }) => {
    const store = props.store
    const [filter, setFilter] = useState("")

    let filteredTraitGroups = synergyAndTraitGroups
        .filter(traitGroup => store.traitOrSynergy === "synergy" || !traitGroup.synergyOnly)

    if (filter.trim().length > 1) {
        filteredTraitGroups = filteredTraitGroups
            .map(group => ({
                ...group,
                traits: group.traits.filter(trait => replaceRsAndConvertToTitleCase(trait).toLowerCase().includes(filter.trim().toLowerCase()))
            }))
            .filter(group => group.traits.length > 0)
    }
    return (
        <>
            <DialogTitle id="form-dialog-title">Add {Utils.camelCaseToTitleCase(store.traitOrSynergy)}</DialogTitle>
            <DialogContent style={synBuilderDialogStyle()}>
                <Box my={1}>
                    <TextField
                        size={"small"}
                        variant={"outlined"}
                        label={"Filter"}
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                    />
                </Box>
                {store.trait != null && (
                    <Box display={"flex"} mb={1}>
                        <TraitBubble
                            traitValue={store.synTraitValue()}
                            trait={store.traitOrSynergy === "trait"}
                        />
                    </Box>
                )}
                <Box width={448} height={400}>
                    {filteredTraitGroups
                        .map(traitGroup => (
                            <DiplayTraitSelectGroup traitGroup={traitGroup} store={store} key={traitGroup.groupName}/>
                        ))}
                </Box>
            </DialogContent>
        </>
    )
})

export const synBuilderDialogStyle = () => {
    if (screenStore.screenSizeMd()) {
        return undefined
    }
    return {width: 520, height: 336}
}

export const DiplayTraitSelectGroup = (props: { store: TraitBuilderStore, traitGroup: SynTraitDisplayGroup }) => {
    const {store, traitGroup} = props
    return (
        <Box mb={1} p={1} style={{backgroundColor: themeStore.darkMode ? grey["700"] : grey["100"], borderRadius: 8}}>
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
                            {replaceRsAndConvertToTitleCase(trait)}
                        </Button>
                    ))}
            </Box>
        </Box>
    )
}
