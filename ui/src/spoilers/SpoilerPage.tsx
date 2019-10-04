import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"
import { Spoiler } from "./Spoiler"
import { spoilerStore } from "./SpoilerStore"
import { SpoilerView } from "./SpoilerView"

interface SpoilerPageProps extends RouteComponentProps<{ spoilerId: string }> {
}

export class SpoilerPage extends React.Component<SpoilerPageProps> {

    render() {
        return <SpoilerContainer spoilerId={this.props.match.params.spoilerId}/>
    }
}

interface SpoilerContainerProps {
    spoilerId: string
}

@observer
class SpoilerContainer extends React.Component<SpoilerContainerProps> {

    componentDidMount(): void {
        const spoilerId = this.props.spoilerId
        spoilerStore.findSpoiler(Number(spoilerId))
    }

    render() {
        if (spoilerStore.spoiler == null) {
            return <Loader/>
        }
        return <SpoilerPageView spoiler={spoilerStore.spoiler}/>
    }
}

interface SpoilerProps {
    spoiler: Spoiler
}

class SpoilerPageView extends React.Component<SpoilerProps> {

    componentDidMount(): void {
        this.setTopbarValues(this.props)
    }

    componentWillReceiveProps(nextProps: SpoilerProps) {
        this.setTopbarValues(nextProps)
    }

    setTopbarValues = (props: SpoilerProps) => {
        uiStore.setTopbarValues(props.spoiler.cardTitle, props.spoiler.cardTitle, "")
    }

    render() {
        const spoiler = this.props.spoiler
        return (
            <div style={{margin: spacing(2), display: "flex", justifyContent: "center"}}>
                <SpoilerView spoiler={spoiler} noLink={true}/>
            </div>
        )
    }
}
