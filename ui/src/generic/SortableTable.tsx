import { TableSortLabel } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { sortBy } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { SortOrder } from "../config/Utils"

export interface SortableTableHeaderInfo<T> {
    /**
     * Either property or transform must be included.
     */
    property?: keyof T
    title: string
    sortable?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform?: (data: T) => any
}

interface SortableTableProps<T> {
    headers: SortableTableHeaderInfo<T>[]
    data: T[]
    defaultSort: keyof T
}

@observer
export class SortableTable<T> extends React.Component<SortableTableProps<T>> {

    store: SortableTableStore<T>

    constructor(props: SortableTableProps<T>) {
        super(props)
        this.store = new SortableTableStore<T>(props.defaultSort, props.data)
    }

    render() {
        const store = this.store
        const {headers} = this.props

        return (
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        {headers.map(header => (
                            <TableCell key={header.title}>
                                {header.property != null && header.sortable ? (
                                    <TableSortLabel
                                        active={store.activeTableSort === header.property}
                                        direction={store.tableSortDir}
                                        onClick={store.changeSortHandler(header.property)}
                                    >
                                        {header.title}
                                    </TableSortLabel>
                                ) : (
                                    <>{header.title}</>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {store.sortedItems.map((datum, idx) => (
                        <TableRow key={idx}>
                            {headers.map(header => (
                                <TableCell key={header.title}>
                                    {header.transform == null ? datum[header.property!] : header.transform(datum)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}

class SortableTableStore<T> {
    @observable
    activeTableSort: keyof T
    @observable
    tableSortDir: SortOrder = "desc"

    @observable
    sortedItems: T[]

    constructor(private defaultSort: keyof T, private data: T[]) {
        this.activeTableSort = defaultSort
        this.sortedItems = data
    }

    resort = () => {
        if (this.sortedItems) {
            this.sortedItems = sortBy(this.sortedItems.slice(), this.activeTableSort)
            if (this.tableSortDir === "desc") {
                this.sortedItems = this.sortedItems.slice().reverse()
            }
        }
    }

    changeSortHandler = (property: keyof T) => {
        return () => {
            if (this.activeTableSort === property) {
                this.tableSortDir = this.tableSortDir === "desc" ? "asc" : "desc"
            } else {
                this.activeTableSort = property
            }
            this.resort()
        }
    }
}
