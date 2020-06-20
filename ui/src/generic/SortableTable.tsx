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
     * Either property or transform must be included. If property is not included and sortable is not false, sortWith must be included.
     *
     * Property or title must be included and unique.
     */
    property?: keyof T
    title?: string

    titleNode?: React.ReactNode

    /**
     * Default true
     */
    sortable?: boolean

    /**
     * Alternative value to sort by instead of property. Property must still be included as a key to tell what is sorted.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sortFunction?: TransformTableData<T>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform?: TransformTableData<T>

    /**
     * property must be included with transformProperty
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformProperty?: (propertyValue: any) => any
    width?: number,
    hide?: boolean
}

interface SortableTableProps<T> {
    headers: SortableTableHeaderInfo<T>[]
    data: T[]
    defaultSort: keyof T
    defaultSortFunction?: TransformTableData<T>
}

@observer
export class SortableTable<T> extends React.Component<SortableTableProps<T>> {

    store: SortableTableStore<T>

    constructor(props: SortableTableProps<T>) {
        super(props)
        this.store = new SortableTableStore<T>(props.defaultSort, props.data, this.props.defaultSortFunction)
    }

    componentDidUpdate(prevProps: SortableTableProps<T>) {
        if (prevProps.data !== this.props.data) {
            this.store.update(this.props.defaultSort, this.props.data, this.props.defaultSortFunction)
        }
    }

    render() {
        const store = this.store
        const {headers} = this.props
        const usableHeaders = headers.filter(header => header.hide !== true)

        return (
            <div style={{overflowX: "auto"}}>
                <Table size={"small"}>
                    <TableHead>
                        <TableRow>
                            {usableHeaders.map((header, idx) => (
                                <TableCell key={header.property?.toString() ?? header.title?.toString() ?? idx} style={{width: header.width}}>
                                    {(header.property != null || header.sortFunction != null) && header.sortable !== false ? (
                                        <TableSortLabel
                                            active={store.activeTableSort === header.property && store.sortFunctionName === header.title}
                                            direction={store.tableSortDir}
                                            onClick={store.changeSortHandler(header)}
                                        >
                                            {header.titleNode}{header.title ?? startCase(header.property as string)}
                                        </TableSortLabel>
                                    ) : (
                                        <>{header.titleNode}{header.title}</>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {store.sortedItems.map((datum, idx) => (
                            <TableRow key={idx}>
                                {usableHeaders.map(header => {
                                    let value
                                    if (header.transform != null) {
                                        value = header.transform(datum)
                                    } else if (header.transformProperty != null) {
                                        value = header.transformProperty(datum[header.property!])
                                    } else {
                                        value = datum[header.property!]
                                    }
                                    return (
                                        <TableCell key={header.property?.toString() ?? header.title?.toString() ?? idx}>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransformTableData <T> = (data: T) => any

class SortableTableStore<T> {

    @observable
    activeTableSort?: keyof T

    sortFunction?: TransformTableData<T>
    sortFunctionName?: React.ReactNode

    @observable
    tableSortDir: SortOrder = "desc"

    @observable
        // @ts-ignore
    sortedItems: T[]

    constructor(private defaultSort: keyof T, private data: T[], private defaultSortFunction?: TransformTableData<T>, private defaultSortFunctionName?: string) {
        this.update(defaultSort, data, defaultSortFunction, defaultSortFunctionName)
    }

    update = (sort: keyof T, data: T[], sortFunction?: TransformTableData<T>, sortFunctionName?: string) => {
        this.activeTableSort = sort
        this.sortedItems = data
        this.sortFunction = sortFunction
        this.sortFunctionName = sortFunctionName
        this.resort()
    }

    resort = () => {
        if (this.sortedItems) {
            this.sortedItems = sortBy(this.sortedItems.slice(), this.sortFunction == null ? this.activeTableSort! : this.sortFunction)
            if (this.tableSortDir === "desc") {
                this.sortedItems = this.sortedItems.slice().reverse()
            }
        }
    }

    changeSortHandler = (header: SortableTableHeaderInfo<T>) => {
        const {property, sortFunction, title} = header
        return () => {
            if ((this.activeTableSort === property && property != null) || this.sortFunctionName === title) {
                this.tableSortDir = this.tableSortDir === "desc" ? "asc" : "desc"
            } else {
                this.activeTableSort = property
            }
            this.sortFunction = sortFunction
            this.sortFunctionName = title
            this.resort()
        }
    }
}
