import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { Redirect } from "react-router-dom"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Loader } from "../../mui-restyled/Loader"
import { uiStore } from "../../ui/UiStore"
import { userStore } from "../../user/UserStore"
import { cardStore } from "../CardStore"
import { KCard } from "../KCard"
import { CardView } from "./CardSimpleView"

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
        if (userStore.isAdmin) {
            return <Redirect to={Routes.editExtraCardInfo(card.extraCardInfo.id)} />
        }
        return <CardPageView card={card}/>
    }
}

interface CardProps {
    card: KCard
}

class CardPageView extends React.Component<CardProps> {

    componentDidMount(): void {
        this.setTopbarValues()
    }

    componentDidUpdate() {
        this.setTopbarValues()
    }

    setTopbarValues = () => {
        const cardTitle = this.props.card.cardTitle
        uiStore.setTopbarValues(cardTitle, cardTitle, "")
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
