import { ArrowUpward } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyButton } from "../mui-restyled/KeyButton"
import { rotateIconStyle } from "./SearchDrawerExpansionPanel"
import { SortDirection } from "../generated-src/SortDirection"

@observer
export class SortDirectionView extends React.Component<{ hasSort: { sortDirection: SortDirection } }> {
    render() {
        const sortDirection = this.props.hasSort.sortDirection
        return (
            <KeyButton
                onClick={() => this.props.hasSort.sortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC}
                icon={true}
                variant={"outlined"}
            >
                <ArrowUpward fontSize={"small"} style={rotateIconStyle(sortDirection === "ASC")}/>
            </KeyButton>
        )
    }
}
