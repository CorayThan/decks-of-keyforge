import { TraitBuilderStore } from "./TraitBuilderStore"
import {
    Box,
    Checkbox,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup
} from "@material-ui/core"
import { Utils } from "../../config/Utils"
import { TraitBubble } from "../../synergy/TraitBubble"
import React from "react"
import { CardType } from "../../generated-src/CardType"
import { SynTraitHouse } from "../../generated-src/SynTraitHouse"
import { synTraitHouseShortLabel } from "../../synergy/SynTraitHouse"
import { SynTraitPlayer } from "../../generated-src/SynTraitPlayer"
import { startCase } from "lodash"
import { observer } from "mobx-react"
import { PlayZone } from "../../generated-src/PlayZone"
import { synBuilderDialogStyle } from "./SelectTraitOrSyn"

export const TraitTargetsSelect = observer((props: { store: TraitBuilderStore }) => {
    const store = props.store
    return (
        <>
            <DialogTitle
                id="form-dialog-title">Select {Utils.camelCaseToTitleCase(store.traitOrSynergy)} Targets</DialogTitle>
            <DialogContent style={synBuilderDialogStyle()}>
                <Box display={"flex"} mb={1}>
                    <TraitBubble
                        traitValue={store.synTraitValue()}
                        trait={store.traitOrSynergy === "trait"}
                    />
                </Box>

                <FormControl>
                    <FormLabel>Affects Card Types</FormLabel>
                    <FormGroup>
                        {(Utils.enumValues(CardType) as CardType[]).map(type => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        checked={store.cardTypes.includes(type)}
                                        onChange={() => {
                                            if (store.cardTypes.includes(type)) {
                                                store.cardTypes = store.cardTypes.filter(toRemove => type !== toRemove)
                                            } else {
                                                store.cardTypes.push(type)
                                            }
                                        }}
                                    />
                                }
                                label={type}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Target Zones</FormLabel>
                    <FormGroup>
                        {(Utils.enumValues(PlayZone) as PlayZone[]).map(type => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        checked={store.playZones.includes(type)}
                                        onChange={() => {
                                            if (store.playZones.includes(type)) {
                                                store.playZones = store.playZones.filter(toRemove => type !== toRemove)
                                            } else {
                                                store.playZones.push(type)
                                            }
                                        }}
                                    />
                                }
                                label={Utils.camelCaseToTitleCase(type)}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>House</FormLabel>
                    <RadioGroup
                        value={store.house}
                        onChange={(event) => store.house = event.target.value as SynTraitHouse}
                    >
                        {Utils.enumValues(SynTraitHouse).map(option => (
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio/>}
                                label={synTraitHouseShortLabel(option as SynTraitHouse)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Player</FormLabel>
                    <RadioGroup
                        value={store.player}
                        onChange={(event) => store.player = event.target.value as SynTraitPlayer}
                        color={"primary"}
                    >
                        {Utils.enumValues(SynTraitPlayer).map(option => (
                            <FormControlLabel key={option} value={option} control={<Radio/>}
                                              label={startCase((option as string).toLowerCase())}/>
                        ))}
                    </RadioGroup>
                </FormControl>

            </DialogContent>
        </>
    )
})

