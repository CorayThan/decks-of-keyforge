import { makeObservable, observable } from "mobx"

export class SelectedOptions {

    @observable
    selectedValues: string[] = []

    constructor(initial?: string[], private onChange?: (newValues: string[]) => void) {
        makeObservable(this)
        if (initial != null) {
            this.selectedValues = initial
        }
    }

    update = (newValues: string[]) => {
        this.selectedValues = newValues
        if (this.onChange) {
            this.onChange(newValues)
        }
    }

    reset = () => this.update([])
}