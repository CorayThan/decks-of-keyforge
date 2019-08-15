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

    render() {
        const cardName = this.props.cardName
        const card = cardStore.fullCardFromCardNameKey(cardName)
        if (card == null || card.house == null) {
            return <Loader/>
        }
        return <CardPageView card={card} />
    }
}

interface CardProps {
    card: KCard
}

class CardPageView extends React.Component<CardProps> {

    componentDidMount(): void {
        this.setTopbarValues(this.props)
    }

    componentWillReceiveProps(nextProps: CardProps) {
        this.setTopbarValues(nextProps)
    }

    setTopbarValues = (props: CardProps) => {
            uiStore.setTopbarValues(props.card.cardTitle, props.card.cardTitle, "")
    }

    render() {
        const card = this.props.card
        return (
            <div style={{margin: spacing(2), display: "flex", justifyContent: "center"}}>
                <CardView card={card} noLink={true}/>
            </div>
        )
    }
}
