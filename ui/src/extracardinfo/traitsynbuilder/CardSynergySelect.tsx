import { TraitBuilderStore } from "./TraitBuilderStore"
import { Box, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import { TraitBubble } from "../../synergy/TraitBubble"
import React, { ChangeEvent } from "react"
import { observer } from "mobx-react"
import { Autocomplete } from "@material-ui/lab"
import { cardStore } from "../../cards/CardStore"
import { spacing } from "../../config/MuiConfig"
import { SynTraitValue } from "../../generated-src/SynTraitValue"
import { SynergyGroupSelect } from "./SynergyGroupSelect"
import { TraitStrengthButton } from "./TraitStrengthSelect"
import { HelperText } from "../../generic/CustomTypographies"

export const CardSynergySelect = observer((props: { store: TraitBuilderStore, existingSynergies: SynTraitValue[] }) => {
    const {store, existingSynergies} = props

    const cardNames = cardStore.cardNames.slice()
    cardNames.push("")

    return (
        <>
            <DialogTitle id="form-dialog-title">
                Select Direct Synergy Card
            </DialogTitle>
            <DialogContent>
                <Box display={"flex"} mb={1}>
                    <TraitBubble
                        traitValue={store.synTraitValue()}
                        trait={store.traitOrSynergy === "trait"}
                    />
                </Box>

                <Autocomplete
                    options={cardNames}
                    value={store.cardName}
                    renderInput={(params) => <TextField {...params} label={"Card"}/>}
                    onChange={(event: ChangeEvent<{}>, newValue: string | null) => store.cardName = newValue ?? ""}
                    clearOnEscape={true}
                    size={"small"}
                />

                {cardNames.find(cardName => cardStore.allTokens.map(token => token.cardTitle).includes(cardName)) != null && (
                    <Box mt={2}>
                    <HelperText>
                        Token Cards automatically find 2 strong matches.<br/>
                        That means synergy will be: strong = 100%, normal = 66%, weak = 50%, extra weak, = 30%
                    </HelperText>
                    </Box>
                )}

                <Box display={"grid"} gridTemplateColumns={"1fr 1fr 1fr 1fr"} gridGap={spacing(1)} my={2}>
                    <TraitStrengthButton name={"Extra Weak Antisynergy"} strength={-1} store={store}
                                         color={"secondary"}/>
                    <TraitStrengthButton name={"Weak Antisynergy"} strength={-2} store={store} color={"secondary"}/>
                    <TraitStrengthButton name={"Normal Antisynergy"} strength={-3} store={store} color={"secondary"}/>
                    <TraitStrengthButton name={"Strong Antisynergy"} strength={-4} store={store} color={"secondary"}/>
                    <TraitStrengthButton name={"Extra Weak Synergy"} strength={1} store={store}/>
                    <TraitStrengthButton name={"Weak Synergy"} strength={2} store={store}/>
                    <TraitStrengthButton name={"Normal Synergy"} strength={3} store={store}/>
                    <TraitStrengthButton name={"Strong Synergy"} strength={4} store={store}/>
                </Box>

                <SynergyGroupSelect store={store} existingSynergies={existingSynergies}/>
            </DialogContent>
        </>
    )
})

