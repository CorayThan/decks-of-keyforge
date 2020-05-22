import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { Loader } from "../mui-restyled/Loader"
import { spoilerStore } from "../spoilers/SpoilerStore"
import { extraCardInfoStore } from "./ExtraCardInfoStore"
import { UpdateExtraCardInfo } from "./UpdateExtraCardInfoPage"

interface UpdateExtraCardInfoPageProps extends RouteComponentProps<{ spoilerId: string }> {
}

@observer
export class UpdateSpoilerAerc extends React.Component<UpdateExtraCardInfoPageProps> {

    componentDidMount(): void {
        spoilerStore.loadAllSpoilers()
        if (this.props.match.params.spoilerId) {
            extraCardInfoStore.findOrCreateSpoilerAerc(Number(this.props.match.params.spoilerId))
        }
    }

    componentDidUpdate(prevProps: UpdateExtraCardInfoPageProps): void {
        if (prevProps.match.params.spoilerId && this.props.match.params.spoilerId != this.props.match.params.spoilerId) {
            extraCardInfoStore.findOrCreateSpoilerAerc(Number(this.props.match.params.spoilerId))
        }
    }

    render() {
        const extraCardInfo = extraCardInfoStore.extraCardInfo
        const spoilers = spoilerStore.spoilers
        if (extraCardInfo == null || spoilers == null) {
            return <Loader/>
        }
        const spoiler = spoilerStore.findSpoilerById(Number(this.props.match.params.spoilerId))
        if (spoiler == null) {
            return <Loader/>
        }
        return <UpdateExtraCardInfo extraCardInfo={extraCardInfo} spoiler={spoiler}/>
    }
}
