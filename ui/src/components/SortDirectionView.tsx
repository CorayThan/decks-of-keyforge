import { ArrowUpward } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { SortDirection } from "../generic/SortDirection"
import { KeyButton } from "../mui-restyled/KeyButton"
import { rotateIconStyle } from "./SearchDrawerExpansionPanel"

@observer
export class SortDirectionView extends React.Component<{ hasSort: { sortDirection: SortDirection } }> {
    render() {
        const sortDirection = this.props.hasSort.sortDirection
        return (
            <KeyButton
                onClick={() => this.props.hasSort.sortDirection = sortDirection === "ASC" ? "DESC" : "ASC"}
                size={"small"}
                variant={"outlined"}
                style={{width: 32, height: 32, minWidth: 32, minHeight: 32}}
            >
                <ArrowUpward fontSize={"small"} style={rotateIconStyle(sortDirection === "ASC")}/>
            </KeyButton>
        )
    }
}
