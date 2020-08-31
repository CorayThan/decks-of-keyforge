import FormControl from "@material-ui/core/FormControl/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup/FormGroup"
import FormLabel from "@material-ui/core/FormLabel/FormLabel"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Expansion } from "../generated-src/Expansion"
import { CheckboxState, CheckboxThreeState } from "../mui-restyled/CheckboxThreeState"
import { activeExpansions, expansionInfoMap, ExpansionLabel } from "./Expansions"

interface ExpansionSelectOrExcludeProps {
    selectedExpansions: SelectedOrExcludedExpansions
    allowExclusions?: boolean
    style?: React.CSSProperties
}

@observer
export class ExpansionSelectOrExclude extends React.Component<ExpansionSelectOrExcludeProps> {
    render() {
        const {selectedExpansions, allowExclusions, style} = this.props
        return (
            <FormControl style={style}>
                <FormLabel style={{marginBottom: spacing(1)}}>Expansions</FormLabel>
                <FormGroup
                    row={true}
                >
                    {activeExpansions.map((expansionValue) => {
                        const select = selectedExpansions.selectedExpansions.filter((selectedExpansion) => selectedExpansion.expansion === expansionValue)
                        return (
                            <ExpansionCheckbox
                                key={expansionValue}
                                selectedExpansion={select[0]}
                                selectedExpansions={selectedExpansions}
                                allowExclusions={allowExclusions}
                            />
                        )
                    })}
                </FormGroup>
            </FormControl>
        )
    }
}

interface ExpansionCheckboxProps {
    selectedExpansion: SelectedOrExcludedExpansion
    selectedExpansions: SelectedOrExcludedExpansions
    allowExclusions?: boolean
}

@observer
export class ExpansionCheckbox extends React.Component<ExpansionCheckboxProps> {

    onChange = (state: CheckboxState) => {
        this.props.selectedExpansions.onExpansionStateChange(this.props.selectedExpansion.expansion, state)
    }

    render() {
        const {selectedExpansion} = this.props
        return (
            <FormControlLabel
                control={
                    <CheckboxThreeState
                        value={selectedExpansion.state}
                        onChange={this.onChange}
                        disallowExcluded={!this.props.allowExclusions}
                    />
                }
                label={<ExpansionLabel expansion={selectedExpansion.expansion} width={56} iconSize={24}/>}
            />
        )
    }
}

export interface SelectedOrExcludedExpansion {
    expansion: Expansion
    state: CheckboxState
}

export class SelectedOrExcludedExpansions {

    @observable
    selectedExpansions: SelectedOrExcludedExpansion[]

    constructor(initialExpansionsSelected: Expansion[], initialExpansionsExcluded?: Expansion[]) {
        this.selectedExpansions = activeExpansions.map(expansionValue => {
            const isSelected = initialExpansionsSelected.indexOf(expansionValue) !== -1
            const isExcluded = initialExpansionsExcluded == null ? false : (initialExpansionsExcluded?.indexOf(expansionValue) !== -1)
            return {
                expansion: expansionValue,
                state: isSelected ? CheckboxState.ON : (isExcluded ? CheckboxState.EXCLUDED : CheckboxState.OFF)
            }
        })
    }

    onExpansionStateChange = (expansion: Expansion, state: CheckboxState) => {
        const toUpdate = this.selectedExpansions.find(selectedExpansion => selectedExpansion.expansion === expansion)!
        toUpdate.state = state
    }

    reset = () => this.selectedExpansions = activeExpansions.map(expansionValue => ({expansion: expansionValue, state: CheckboxState.OFF}))

    getExpansionsSelectedTrue = () => this.selectedExpansions.filter(expansion => expansion.state === CheckboxState.ON).map(expansion => expansion.expansion)
    getExpansionsExcludedTrue = () => this.selectedExpansions.filter(expansion => expansion.state === CheckboxState.EXCLUDED).map(expansion => expansion.expansion)

    expansionsAsNumberArray = () => this.getExpansionsSelectedTrue().map(expansion => expansionInfoMap.get(expansion)!.expansionNumber)
}
