import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { MultiSelect, SelectedValues } from "../../mui-restyled/MultiSelect"
import { Rarity } from "../rarity/Rarity"

const raritySelectValues: (Rarity | "Special")[] = [
    Rarity.Common,
    Rarity.Uncommon,
    Rarity.Rare,
    "Special",
]

@observer
export class RaritySelect extends React.Component<{ selectedRarities: SelectedRarities }> {

    render() {
        const selectedRarities = this.props.selectedRarities
        return (
            <MultiSelect name={"Rarity"} options={raritySelectValues} selected={selectedRarities}/>
        )
    }
}

export class SelectedRarities implements SelectedValues<Rarity | "Special"> {
    selectedValues: IObservableArray<Rarity | "Special"> = observable([])

    reset = () => this.selectedValues.clear()

    toArray = (): Rarity[] => {
        const rarities: Rarity[] = []

        this.selectedValues.forEach(selectedRarity => {
            if (selectedRarity === "Special") {
                rarities.push(Rarity.FIXED)
                rarities.push(Rarity.Variant)
            } else {
                rarities.push(selectedRarity)
            }
        })

        return rarities
    }
}
