import { MenuItem, TextField } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Expansion } from "../generated-src/Expansion"
import { expansionInfoMap, expansionInfos } from "./Expansions"

export class SelectedExpansion {
    @observable
    expansion: "" | Expansion = ""

    @observable
    onlyThisExpansion = false

    constructor(expansions?: Expansion[], selectFinal?: boolean) {
        makeObservable(this)
        if (expansions && expansions.length > 0) {
            this.expansion = expansions[selectFinal ? (expansions.length - 1) : 0]
        }
    }

    handleExpansionSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const expansionAndOnly = event.target.value
        let expansion
        if (expansionAndOnly.startsWith("only")) {
            this.onlyThisExpansion = true
            expansion = expansionAndOnly.substring(4)
        } else {
            this.onlyThisExpansion = false
            expansion = expansionAndOnly
        }

        this.expansion = expansion as "" | Expansion
    }

    currentExpansion = () => {
        if (this.expansion) {
            return this.expansion
        }
        return undefined
    }

    currentExpansionOrDefault = () => {
        return this.currentExpansion() ?? Expansion.CALL_OF_THE_ARCHONS
    }

    expansionsAsNumberArray = (): number[] => {
        const expansionNumber = this.currentExpansion()
        if (expansionNumber == null) {
            return []
        }
        return [expansionInfoMap.get(expansionNumber)!.expansionNumber]
    }

    reset = () => this.expansion = ""
}

interface ExpansionSelectorProps {
    store: SelectedExpansion
    displayNoneOption?: boolean
    small?: boolean
    style?: React.CSSProperties
    displayAnomaly?: boolean
    includeOnlys?: boolean
}

@observer
export class ExpansionSelector extends React.Component<ExpansionSelectorProps> {
    render() {
        const {store, displayNoneOption, small, style, displayAnomaly, includeOnlys} = this.props
        return (
            <TextField
                select={true}
                label={"Expansion"}
                value={store.expansion}
                onChange={store.handleExpansionSelected}
                style={{minWidth: small ? 104 : 120, ...style}}
            >
                {displayNoneOption ? (
                    <MenuItem value={""}>
                        Any
                    </MenuItem>
                ) : null}
                {expansionInfos
                    .filter(info => displayAnomaly ? true : info.backendEnum !== Expansion.ANOMALY_EXPANSION)
                    .map(info => (
                        <MenuItem key={info.backendEnum} value={info.backendEnum}>
                            {small ? info.abbreviation : info.name}
                        </MenuItem>
                    ))}
                {includeOnlys && expansionInfos
                    .filter(info => info.backendEnum !== Expansion.ANOMALY_EXPANSION)
                    .map(info => (
                        <MenuItem key={"only" + info.backendEnum} value={"only" + info.backendEnum}>
                            {small ? info.abbreviation : info.name} Only
                        </MenuItem>
                    ))}
            </TextField>
        )
    }
}
