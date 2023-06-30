import * as React from "react"
import { ChangeEvent } from "react"
import { DeckFilters } from "./DeckFilters"
import { observer } from "mobx-react"
import { Autocomplete } from "@material-ui/lab"
import TextField from "@material-ui/core/TextField/TextField"

export interface DeckTokenCardSelectProps {
    tokenNames: string[]
    filters: DeckFilters
}

export const DeckTokenCardSelect = observer((props: DeckTokenCardSelectProps) => {
    const {tokenNames, filters} = props
    const selectedTokens = filters.tokens.slice()

    const updateSelectedTokens = (tokens: string[]) => props.filters.tokens = tokens

    return (
        <Autocomplete
            multiple={true}
            // @ts-ignore
            options={tokenNames}
            value={selectedTokens}
            renderInput={(params) => <TextField {...params} label={"Any of these tokens"}/>}
            onChange={(event: ChangeEvent<{}>, newValue: string[] | null) => {
                updateSelectedTokens(newValue ?? [])
            }}
        />
    )
})
