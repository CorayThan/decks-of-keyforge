import { TableSortLabel } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { sortBy, startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { SortOrder } from "../config/Utils"


export interface SortableTableHeaderInfo<T> {
    /**
     * Either property or transform must be included.
     */
    property?: keyof T
    title?: string
    sortable?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform?: (data: T) => any

    /**
     * property must be included with transformProperty
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformProperty?: (propertyValue: any) => any
    width?: number
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

    componentDidUpdate(prevProps: SortableTableProps<T>) {
        if (prevProps.data !== this.props.data) {
            this.store.update(this.props.defaultSort, this.props.data)
        }
    }

    render() {
        const store = this.store
        const {headers} = this.props

        return (
            <div style={{overflowX: "auto"}}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            {headers.map(header => (
                                <TableCell key={header.title ?? header.property?.toString()} style={{width: header.width}}>
                                    {header.property != null && header.sortable !== false ? (
                                        <TableSortLabel
                                            active={store.activeTableSort === header.property}
                                            direction={store.tableSortDir}
                                            onClick={store.changeSortHandler(header.property)}
                                        >
                                            {header.title ?? startCase(header.property as string)}
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
                                {headers.map(header => {
                                    let value
                                    if (header.transform != null) {
                                        value = header.transform(datum)
                                    } else if (header.transformProperty != null) {
                                        value = header.transformProperty(datum[header.property!])
                                    } else {
                                        value = datum[header.property!]
                                    }
                                    return (
                                        <TableCell key={header.title ?? header.property?.toString()}>
                                            <div style={{width: header.width}}>
                                                {value}
                                            </div>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

class SortableTableStore<T> {

    @observable
        // @ts-ignore
    activeTableSort: keyof T

    @observable
    tableSortDir: SortOrder = "desc"

    @observable
        // @ts-ignore
    sortedItems: T[]

    constructor(private defaultSort: keyof T, private data: T[]) {
        this.update(defaultSort, data)
    }

    update = (defaultSort: keyof T, data: T[]) => {
        this.activeTableSort = defaultSort
        this.sortedItems = data
        this.resort()
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
