import IconButton from "@material-ui/core/IconButton/IconButton"
import { ArrowDownward, ArrowUpward } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { SortDirection } from "../generic/SortDirection"

@observer
export class SortDirectionView extends React.Component<{ sortDirectionController: SortDirectionController }> {
    render() {
        const icon = this.props.sortDirectionController.direction === "ASC" ? <ArrowUpward fontSize={"small"}/> : <ArrowDownward fontSize={"small"}/>
        return (
            <IconButton
                onClick={() => this.props.sortDirectionController.switch()}
            >
                {icon}
            </IconButton>
        )
    }
}

export class SortDirectionController {
    @observable
    direction: SortDirection = "DESC"

    switch = () => this.direction = this.direction === "ASC" ? "DESC" : "ASC"
}
