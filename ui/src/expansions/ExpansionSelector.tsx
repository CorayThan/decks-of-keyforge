import { MenuItem, TextField } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { BackendExpansion, expansionInfoMap, expansionInfos } from "./Expansions"

export class SelectedExpansion {
    @observable
    expansion: "" | BackendExpansion = ""

    constructor(expansions?: BackendExpansion[]) {
        if (expansions && expansions.length > 0) {
            this.expansion = expansions[0]
        }
    }

    handleExpansionSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.expansion = event.target.value as "" | BackendExpansion
    }

    expansionNumber = () => {
        if (this.expansion) {
            return this.expansion
        }
        return undefined
    }

    expansionsAsArray = (): BackendExpansion[] => {
        const expansionNumber = this.expansionNumber()
        if (expansionNumber == null) {
            return []
        }
        return [expansionNumber]
    }

    expansionsAsNumberArray = (): number[] => {
        const expansionNumber = this.expansionNumber()
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
}

@observer
export class ExpansionSelector extends React.Component<ExpansionSelectorProps> {
    render() {
        const {store, displayNoneOption, small, style} = this.props
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
                {expansionInfos.map(info => (
                    <MenuItem key={info.backendEnum} value={info.backendEnum}>
                        {small ? info.abbreviation : info.name}
                    </MenuItem>
                ))}
            </TextField>
        )
    }
}
