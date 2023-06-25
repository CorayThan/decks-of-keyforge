import { TraitBuilderStore } from "./TraitBuilderStore"
import { Box, Button, DialogContent, DialogTitle } from "@material-ui/core"
import { Utils } from "../../config/Utils"
import { TraitBubble } from "../../synergy/TraitBubble"
import { spacing } from "../../config/MuiConfig"
import Typography from "@material-ui/core/Typography/Typography"
import { SynTraitRatingValues } from "../../synergy/SynTraitValue"
import React from "react"
import { HelperText } from "../../generic/CustomTypographies"

export const TraitStrengthSelect = (props: { store: TraitBuilderStore }) => {
    const store = props.store
    const postiveName = store.traitOrSynergy === "synergy" ? "Synergy" : "Trait"
    return (
        <>
            <DialogTitle
                id="form-dialog-title">Select {Utils.camelCaseToTitleCase(store.traitOrSynergy)} Strength</DialogTitle>
            <DialogContent>
                <Box display={"flex"}>
                    <TraitBubble
                        traitValue={store.synTraitValue()}
                        trait={store.traitOrSynergy === "trait"}
                    />
                </Box>

                <Box display={"grid"} gridTemplateColumns={"1fr 1fr 1fr 1fr"} gridGap={spacing(1)} my={2}>
                    {store.traitOrSynergy === "synergy" && (
                        <>
                            <TraitStrengthButton name={"Extra Weak Antisynergy"} strength={-1} store={store} color={"secondary"}/>
                            <TraitStrengthButton name={"Weak Antisynergy"} strength={-2} store={store} color={"secondary"}/>
                            <TraitStrengthButton name={"Normal Antisynergy"} strength={-3} store={store} color={"secondary"}/>
                            <TraitStrengthButton name={"Strong Antisynergy"} strength={-4} store={store} color={"secondary"}/>
                        </>
                    )}

                    <>
                        <TraitStrengthButton name={"Extra Weak " + postiveName} strength={1} store={store}/>
                        <TraitStrengthButton name={"Weak " + postiveName} strength={2} store={store}/>
                        <TraitStrengthButton name={"Normal " + postiveName} strength={3} store={store}/>
                        <TraitStrengthButton name={"Strong " + postiveName} strength={4} store={store}/>
                    </>
                </Box>

                <HelperText color={"textPrimary"} style={{marginBottom: spacing(1)}}>
                    Remember the necessary matches to max out a Synergy + Trait pair.
                </HelperText>
                <Box display={"grid"} gridTemplateColumns={"1fr 1fr"} gridColumnGap={spacing(2)}
                     gridRowGap={spacing(0.5)}>
                    <Typography variant={"body2"} style={{fontWeight: "bold"}}>Strong + Strong</Typography>
                    <Typography>2 matches</Typography>
                    <Typography variant={"body2"} style={{fontWeight: "bold"}}>Normal + Strong</Typography>
                    <Typography>3 matches</Typography>
                    <Typography variant={"body2"} style={{fontWeight: "bold"}}>
                        Normal + Normal / Weak + Strong
                    </Typography>
                    <Typography>4 matches</Typography>
                    <Typography variant={"body2"} style={{fontWeight: "bold"}}>
                        Weak + Normal / Extra weak + Strong
                    </Typography>
                    <Typography>6.7 matches</Typography>
                    <Typography variant={"body2"} style={{fontWeight: "bold"}}>
                        Extra weak + Normal / Weak + Weak
                    </Typography>
                    <Typography>10 matches</Typography>
                </Box>

            </DialogContent>
        </>
    )
}

export const TraitStrengthButton = (props: { name: string, strength: SynTraitRatingValues, store: TraitBuilderStore, color?: "secondary" }) => {
    return (
        <Button
            variant={"contained"}
            color={props.color ?? "primary"}
            size={"small"}
            onClick={() => {
                props.store.rating = props.strength
                props.store.navigateToNextPage()
            }}
        >
            {props.name}
        </Button>
    )
}
