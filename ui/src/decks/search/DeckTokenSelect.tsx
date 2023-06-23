import { Checkbox, FormControl, Input, InputLabel, ListItemText, MenuItem, Select } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { log, prettyJson } from "../../config/Utils"

export interface DeckCardSelectProps {
    tokenNames: string[]
    selectedTokens: string[]
    updateSelectedTokens: (tokens: string[]) => void
}

export const DeckTokenSelect = (props: DeckCardSelectProps) => {
    const {tokenNames, selectedTokens, updateSelectedTokens} = props

    log.info(`Selected tokens is ${prettyJson(selectedTokens)}`)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        updateSelectedTokens(event.target.value as string[])
    }

    return (
        <>
            <FormControl style={{minWidth: 120, marginRight: spacing(2), marginBottom: spacing(2)}}>
                <InputLabel shrink={selectedTokens.length !== 0} id={"tokenSelectInputLabelId"}>Token Creatures</InputLabel>
                <Select
                    id={"tokenSelectId"}
                    labelId={"tokenSelectInputLabelId"}
                    multiple={true}
                    value={selectedTokens}
                    onChange={handleChange}
                    input={<Input/>}
                    renderValue={(selected) => (selected as string[]).join(", ")}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250
                            }
                        }
                    }}
                >
                    {tokenNames.map(token => {
                        return (
                            <MenuItem key={token} value={token}>
                                <Checkbox checked={selectedTokens.indexOf(token) > -1}/>
                                <ListItemText primary={token}/>
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </>
    )
}
