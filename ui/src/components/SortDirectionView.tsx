import { ArrowDownward, ArrowUpward } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { SortDirection } from "../generic/SortDirection"
import { KeyButton } from "../mui-restyled/KeyButton"

@observer
export class SortDirectionView extends React.Component<{ hasSort: {sortDirection: SortDirection}}> {
    render() {
        const sortDirection = this.props.hasSort.sortDirection
        const icon = sortDirection === "ASC" ? <ArrowUpward fontSize={"small"}/> : <ArrowDownward fontSize={"small"}/>
        return (
            <KeyButton
                onClick={() => this.props.hasSort.sortDirection = sortDirection === "ASC" ? "DESC" : "ASC"}
                size={"small"}
                mini={true}
                variant={"outlined"}
                style={{width: 32, height: 32, minWidth: 32, minHeight: 32}}
            >
                {icon}
            </KeyButton>
        )
    }
}
