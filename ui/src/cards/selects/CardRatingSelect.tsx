import { range } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardQualityIcon } from "../../generic/icons/CardQualityIcon"
import { MultiSelect, MultiSelectOption, SelectedValues } from "../../mui-restyled/MultiSelect"

const ratingOptions: MultiSelectOption[] = range(1, 6)
    .map(rating => ({option: <CardQualityIcon quality={rating}/>, value: (rating - 1).toString()}))

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
