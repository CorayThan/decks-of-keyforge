import IconButton from "@material-ui/core/IconButton/IconButton"
import { ArrowDownward, ArrowUpward } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { SortDirection } from "../generic/SortDirection"

@observer
export class SortDirectionView extends React.Component<{ hasSort: {sortDirection: SortDirection}}> {
    render() {
        const sortDirection = this.props.hasSort.sortDirection
        const icon = sortDirection === "ASC" ? <ArrowUpward fontSize={"small"}/> : <ArrowDownward fontSize={"small"}/>
        return (
            <IconButton
                onClick={() => this.props.hasSort.sortDirection = sortDirection === "ASC" ? "DESC" : "ASC"}
            >
                {icon}
            </IconButton>
        )
    }
}
