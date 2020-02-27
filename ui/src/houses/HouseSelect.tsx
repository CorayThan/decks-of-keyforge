import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControl from "@material-ui/core/FormControl/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup/FormGroup"
import FormLabel from "@material-ui/core/FormLabel/FormLabel"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { House, HouseLabel, HouseValue, houseValuesArray } from "./House"

interface HouseSelectProps {
    selectedHouses: SelectedHouses
    options?: HouseValue[]
    style?: React.CSSProperties
}

@observer
export class HouseSelect extends React.Component<HouseSelectProps> {
    render() {
        const {selectedHouses, options, style} = this.props
        const selectedHousesGotten = selectedHouses.getSelectedHouses()
        return (
            <FormControl style={style}>
                <FormLabel style={{marginBottom: spacing(1)}}>Houses</FormLabel>
                <FormGroup
                    row={true}
                >
                    {(options == null ? houseValuesArray : options).map((houseValue) => {
                        const select = selectedHousesGotten.filter((selectedHouse) => selectedHouse.house === houseValue.house)
                        return (<HouseCheckbox key={houseValue.house} selectedHouse={select[0]} selectedHouses={selectedHouses}/>)
                    })}
                </FormGroup>
            </FormControl>
        )
    }
}

interface HouseCheckboxProps {
    selectedHouse: SelectedHouse
    selectedHouses: SelectedHouses
}

@observer
export class HouseCheckbox extends React.Component<HouseCheckboxProps> {

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.selectedHouses.onHouseSelected(this.props.selectedHouse.house, event.target.checked)
    }

    render() {
        const {selectedHouse} = this.props
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedHouse.selected}
                        onChange={this.handleChange}
                    />
                }
                label={<HouseLabel house={selectedHouse.house} width={56}/>}
            />
        )
    }
}

export interface SelectedHouse {
    house: House
    selected: boolean
}

export class SelectedHouses {

    maxSelected?: number
    selectionOrder: House[] = []

    @observable
    private selectedHouses: SelectedHouse[] = houseValuesArray.map(houseValue => ({house: houseValue.house, selected: false}))

    constructor(initialHouses?: House[], maxSelected?: number) {
        this.maxSelected = maxSelected
        this.selectedHouses = houseValuesArray.map(houseValue => {
            return {house: houseValue.house, selected: initialHouses ? initialHouses.indexOf(houseValue.house) !== -1 : false}
        })
        if (initialHouses != null) {
            this.selectionOrder = initialHouses.slice()
        }
    }

    onHouseSelected = (house: House, selected: boolean) => {
        const toUpdate = this.selectedHouses.find(selectedHouse => selectedHouse.house === house)!
        toUpdate.selected = selected
        if (this.maxSelected != null) {
            if (selected) {
                this.selectionOrder.push(house)
            } else {
                const idx = this.selectionOrder.indexOf(house)
                if (idx !== -1) {
                    this.selectionOrder.splice(idx, 1)
                }
            }
            if (this.selectionOrder.length > this.maxSelected) {
                this.onHouseSelected(this.selectionOrder[0], false)
            }
        }
    }

    reset = () => this.selectedHouses = houseValuesArray.map(houseValue => ({house: houseValue.house, selected: false}))

    getSelectedHouses = () => this.selectedHouses.slice()

    getHousesSelectedTrue = () => this.selectedHouses.filter(house => house.selected).map(house => house.house)

    toArray = () => this.getSelectedHouses()
        .filter(selectedHouse => selectedHouse.selected)
        .map(selectedHouse => selectedHouse.house)
}
