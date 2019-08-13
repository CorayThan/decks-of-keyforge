import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"
import { CardView } from "./CardSimpleView"
import { cardStore } from "./CardStore"
import { KCard } from "./KCard"

interface CardPageProps extends RouteComponentProps<{ cardName: string }> {
}

export class CardPage extends React.Component<CardPageProps> {

    render() {
        return <CardContainer cardName={this.props.match.params.cardName}/>
    }
}

interface CardContainerProps {
    cardName: string
}

@observer
class CardContainer extends React.Component<CardContainerProps> {

    constructor(props: CardContainerProps) {
        super(props)
        uiStore.setTopbarValues(props.cardName, props.cardName, "")
    }

    render() {
        const cardName = this.props.cardName
        const card = cardStore.fullCardFromCardName(cardName)
        if (card == null || card.house == null) {
            return <Loader/>
        }
        return (
            <div style={{margin: spacing(2), display: "flex", justifyContent: "center"}}>
                <CardView card={card as KCard} noLink={true}/>
            </div>
        )
    }
}
