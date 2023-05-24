import {TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import {observer} from "mobx-react"
import React, {ChangeEvent} from "react"
import {cardStore} from "./CardStore"
import {ArrayUtils} from "../config/ArrayUtils";

export interface SingleOption {
    option: string
}

interface SingleCardSearchSuggestProps {
    style?: React.CSSProperties
    selected: SingleOption
    placeholder: string
    names?: string[]
}

@observer
export class SingleCardSearchSuggest extends React.Component<SingleCardSearchSuggestProps> {
    render() {
        const {style, selected} = this.props
        const names = this.props.names ?? cardStore.cardNames
        return (
            <Autocomplete
                options={ArrayUtils.arrPlus(names, "")}
                value={selected.option}
                renderInput={(params) => <TextField {...params} label={"Card"}/>}
                onChange={(event: ChangeEvent<{}>, newValue: string | null) => selected.option = newValue ?? ""}
                clearOnEscape={true}
                style={style}
            />
        )
    }
}
