import { observer } from "mobx-react"
import React from "react"
import { KeySingleSearchSuggest, SingleOption } from "../mui-restyled/KeySingleSearchSuggest"
import { cardStore } from "./CardStore"


interface SingleCardSearchSuggestProps {
    style?: React.CSSProperties
    selected: SingleOption
    placeholder: string
    names?: string[]
}

@observer
export class SingleCardSearchSuggest extends React.Component<SingleCardSearchSuggestProps> {
    render() {
        const names = this.props.names?.map(name => ({label: name, value: name})) ?? cardStore.cardNames
        return <KeySingleSearchSuggest {...this.props} options={names}/>
    }
}
