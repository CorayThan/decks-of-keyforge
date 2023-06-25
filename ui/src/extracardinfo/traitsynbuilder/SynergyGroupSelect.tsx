import { TraitBuilderStore } from "./TraitBuilderStore"
import { Box, Checkbox, FormControlLabel, MenuItem, Popover, TextField } from "@material-ui/core"
import React, { useState } from "react"
import { observer } from "mobx-react"
import { spacing } from "../../config/MuiConfig"
import { SynGroup } from "./SynBuilderTypes"
import { Help } from "@material-ui/icons"
import IconButton from "@material-ui/core/IconButton/IconButton"
import Typography from "@material-ui/core/Typography/Typography"
import { SynTraitValue } from "../../generated-src/SynTraitValue"

export const SynergyGroupSelect = observer((props: {
    store: TraitBuilderStore,
    existingSynergies: SynTraitValue[]
}) => {
    const {store, existingSynergies} = props
    const [groupHelperEl, setGroupHelperEl] = useState<Element | undefined>(undefined)
    const groupHelperOpen = !groupHelperEl
    const groupHelperId = groupHelperOpen ? "group-helper-pop" : undefined

    const existingGroups = existingSynergies
        .filter(syn => syn.synergyGroup != null)
        .map(syn => ({
            group: syn.synergyGroup!,
            max: syn.synergyGroupMax!,
            primary: syn.primaryGroup,
        }))

    return (
        <Box display={"flex"} alignItems={"center"} mt={2}>
            <TextField
                select={true}
                label={"Group"}
                value={store.group}
                onChange={(event) => {
                    const synGroup = event.target.value as SynGroup
                    store.group = synGroup
                    const existing = existingGroups.filter(group => group.group === synGroup)
                    if (existing.length > 0) {
                        store.hasExistingGroup = true
                        store.groupMax = `${existing[0].max}`
                        store.primaryGroup = existing[0].primary
                    } else {
                        store.hasExistingGroup = false
                    }
                }}
                style={{width: 64, marginRight: spacing(1)}}
            >
                <MenuItem value={""}>
                    None
                </MenuItem>
                <MenuItem value={"A"}>
                    A
                </MenuItem>
                <MenuItem value={"B"}>
                    B
                </MenuItem>
                <MenuItem value={"C"}>
                    C
                </MenuItem>
                <MenuItem value={"D"}>
                    D
                </MenuItem>
            </TextField>
            <TextField
                label="Max"
                value={store.groupMax}
                type={"number"}
                onChange={(event) => store.groupMax = event.target.value}
                style={{width: 64, marginRight: spacing(1)}}
                disabled={store.group === "" || store.hasExistingGroup}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={store.primaryGroup}
                        onChange={() => store.primaryGroup = !store.primaryGroup}
                        disabled={store.group === "" || store.hasExistingGroup}
                    />
                }
                label="Primary"
            />
            <IconButton
                onClick={(event) => setGroupHelperEl(event.currentTarget)}
                aria-describedby={groupHelperId}
            >
                <Help/>
            </IconButton>
            <Popover
                id={groupHelperId}
                open={!groupHelperOpen}
                anchorEl={groupHelperEl}
                onClose={() => setGroupHelperEl(undefined)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Box maxWidth={400} p={1}>
                    <Typography style={{marginBottom: spacing(1)}}>
                        Use synergy groups sparingly! They should only be used when a card cannot reach
                        its full potential without multiple synergies acting in concert.
                    </Typography>
                    <Typography style={{marginBottom: spacing(1)}}>
                        Set the same group on multiple synergies to group them together and cap the
                        maximum % they can contribute to a card's synergy total as a group.
                    </Typography>
                    <Typography>
                        If a group is the primary group, then other
                        groups' maximum % contribution to the synergy total is capped at the actual
                        synergy % of the primary group. e.g. Chronus synergizes with Protects Creatures,
                        but never by a higher % than its synergy from bonus draw pips.
                    </Typography>
                </Box>
            </Popover>
        </Box>
    )
})

