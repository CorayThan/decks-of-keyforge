import { MenuItem, TextField } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { expansionInfos } from "./Expansions"

export class SelectedExpansion {
    @observable
    expansion = ""

    constructor(expansion?: string) {
        if (expansion) {
            this.expansion = expansion
        }
    }

    handleExpansionSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.expansion = event.target.value
    }

    expansionNumber = () => {
        if (this.expansion) {
            return Number(this.expansion)
        }
        return undefined
    }

    expansionsAsArray = (): number[] => {
        const expansionNumber = this.expansionNumber()
        if (expansionNumber == null) {
            return []
        }
        return [expansionNumber]
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
                style={{minWidth: 120, ...style}}
            >
                {displayNoneOption ? (
                    <MenuItem value={""}>
                        Any
                    </MenuItem>
                ) : null}
                {expansionInfos.map(info => (
                    <MenuItem key={info.expansionNumber} value={info.expansionNumber}>
                        {small ? info.abbreviation : info.name}
                    </MenuItem>
                ))}
            </TextField>
        )
    }
}
