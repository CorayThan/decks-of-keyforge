import { ArrowUpward } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { themeStore } from "../config/MuiConfig"
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
                icon={true}
                variant={"outlined"}
            >
                <ArrowUpward fontSize={"small"} style={rotateIconStyle(sortDirection === "ASC")}/>
            </KeyButton>
        )
    }
}
