import { MenuItem, TextField } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Utils } from "../../config/Utils"
import { cardStore } from "../CardStore"

@observer
export class PublishDateSelect extends React.Component<{ selected: SelectedPublishDate }> {

    render() {
        const {selected} = this.props
        return (
            <TextField
                select={true}
                label={"AERC Publish Date"}
                value={selected.date}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => selected.date = event.target.value}
                style={{minWidth: 160}}
            >
                <MenuItem value={""}>
                    All
                </MenuItem>
                {cardStore.aercUpdateDates.map(option => (
                    <MenuItem key={option} value={option}>
                        {Utils.formatDate(option)}
                    </MenuItem>
                ))}
            </TextField>
        )
    }
}

export class SelectedPublishDate {
    @observable
    date: string

    constructor(initial?: string) {
        this.date = initial ?? ""
    }

    reset = () => this.date = ""
}
