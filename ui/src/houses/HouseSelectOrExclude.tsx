import FormControl from "@material-ui/core/FormControl/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup/FormGroup"
import FormLabel from "@material-ui/core/FormLabel/FormLabel"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { CheckboxState, CheckboxThreeState } from "../mui-restyled/CheckboxThreeState"
import { House, HouseLabel, HouseValue, houseValuesArray } from "./House"

interface HouseSelectOrExcludeProps {
    selectedHouses: SelectedOrExcludedHouses
    options?: HouseValue[]
    style?: React.CSSProperties
}

@observer
export class HouseSelectOrExclude extends React.Component<HouseSelectOrExcludeProps> {
    render() {
        const {selectedHouses, options, style} = this.props
        return (
            <FormControl style={style}>
                <FormLabel style={{marginBottom: spacing(1)}}>Houses</FormLabel>
                <FormGroup
                    row={true}
                >
                    {(options == null ? houseValuesArray : options).map((houseValue) => {
                        const select = selectedHouses.selectedHouses.filter((selectedHouse) => selectedHouse.house === houseValue.house)
                        return (<HouseCheckbox key={houseValue.house} selectedHouse={select[0]} selectedHouses={selectedHouses}/>)
                    })}
                </FormGroup>
            </FormControl>
        )
    }
}

interface HouseCheckboxProps {
    selectedHouse: SelectedOrExcludedHouse
    selectedHouses: SelectedOrExcludedHouses
}

@observer
export class HouseCheckbox extends React.Component<HouseCheckboxProps> {

    onChange = (state: CheckboxState) => {
        this.props.selectedHouses.onHouseStateChange(this.props.selectedHouse.house, state)
    }

    render() {
        const {selectedHouse} = this.props
        return (
            <FormControlLabel
                control={
                    <CheckboxThreeState
                        value={selectedHouse.state}
                        onChange={this.onChange}
                    />
                }
                label={<HouseLabel house={selectedHouse.house} width={56}/>}
            />
        )
    }
}

export interface SelectedOrExcludedHouse {
    house: House
    state: CheckboxState
}

export class SelectedOrExcludedHouses {

    @observable
    selectedHouses: SelectedOrExcludedHouse[]

    constructor(initialHousesSelected: House[], initialHousesExcluded: House[]) {
        this.selectedHouses = houseValuesArray.map(houseValue => {
            const isSelected = initialHousesSelected.indexOf(houseValue.house) !== -1
            const isExcluded = initialHousesExcluded.indexOf(houseValue.house) !== -1
            return {
                house: houseValue.house,
                state: isSelected ? CheckboxState.ON : (isExcluded ? CheckboxState.EXCLUDED : CheckboxState.OFF)
            }
        })
    }

    onHouseStateChange = (house: House, state: CheckboxState) => {
        const toUpdate = this.selectedHouses.find(selectedHouse => selectedHouse.house === house)!
        toUpdate.state = state
    }

    reset = () => this.selectedHouses = houseValuesArray.map(houseValue => ({house: houseValue.house, state: CheckboxState.OFF}))

    getHousesSelectedTrue = () => this.selectedHouses.filter(house => house.state === CheckboxState.ON).map(house => house.house)
    getHousesExcludedTrue = () => this.selectedHouses.filter(house => house.state === CheckboxState.EXCLUDED).map(house => house.house)

    validHouseSelection = () => {
        const totalCount = this.selectedHouses.length
        const requiredCount = this.getHousesSelectedTrue().length
        const excludedCount = this.getHousesExcludedTrue().length
        return totalCount - excludedCount > 2 && (requiredCount < 4 || excludedCount === 0)
    }
}
