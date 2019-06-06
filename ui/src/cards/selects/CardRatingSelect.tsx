import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardQualityIcon } from "../../generic/icons/CardQualityIcon"
import { MultiSelect, MultiSelectOption, SelectedValues } from "../../mui-restyled/MultiSelect"

const ratingOptions: MultiSelectOption[] = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]
    .map(rating => ({option: <CardQualityIcon quality={rating}/>, value: (rating).toString()}))

@observer
export class CardRatingSelect extends React.Component<{ selectedRatings: SelectedCardRatings }> {

    render() {
        const selectedRatings = this.props.selectedRatings
        return (
            <MultiSelect name={"Rating"} options={ratingOptions} selected={selectedRatings}/>
        )
    }
}

export class SelectedCardRatings implements SelectedValues<string> {
    selectedValues: IObservableArray<string> = observable([])

    reset = () => this.selectedValues.clear()

    toArray = (): number[] => this.selectedValues.map(rating => Number(rating))
}
