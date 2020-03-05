import { IObservableArray } from "mobx"
import { SortOrder } from "../config/Utils"

export interface TableSortStore<T> {
    activeTableSort: string
    tableSortDir: SortOrder

    sortedItems?: IObservableArray<T>

    resort: () => void

    changeSortHandler: (property: string) => void
}
