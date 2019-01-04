import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { DeckStatsView } from "./DeckStatsView"
import { DeckStore } from "./DeckStore"
import { DeckSynergiesInfoView } from "./DeckSynergiesInfoView"
import { DeckViewSmall } from "./DeckViewSmall"
import { SaleInfoView } from "./sales/SaleInfoView"

interface DeckViewPageProps extends RouteComponentProps<{ keyforgeDeckId: string }> {
}

export class DeckViewPage extends React.Component<DeckViewPageProps> {
    render() {
        return (<DeckViewFull keyforgeDeckId={this.props.match.params.keyforgeDeckId}/>)
    }
}

interface DeckViewFullProps {
    keyforgeDeckId: string
}

@observer
export class DeckViewFull extends React.Component<DeckViewFullProps> {

    constructor(props: DeckViewFullProps) {
        super(props)
        DeckStore.instance.deck = undefined
        DeckStore.instance.saleInfo = undefined
        UiStore.instance.setTopbarValues("Deck", "Deck")
    }

    componentDidMount(): void {
        DeckStore.instance.findDeck(this.props.keyforgeDeckId)
        DeckStore.instance.findDeckSaleInfo(this.props.keyforgeDeckId)
    }

    render() {
        log.debug("Rendering DeckViewFull")
        const {deck, saleInfo} = DeckStore.instance
        if (!deck) {
            return <Loader/>
        }
        let saleInfoComponent = null
        if (saleInfo) {
            saleInfoComponent = <SaleInfoView saleInfo={saleInfo}/>
        } else {
            saleInfoComponent = <Loader/>
        }
        const wrapperStyle: React.CSSProperties = {display: "flex", flexWrap: "wrap"}
        return (
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <div style={wrapperStyle}>
                    <DeckViewSmall deck={deck.deck} fullVersion={true}/>
                    <DeckStatsView deck={deck.deck}/>
                </div>
                <div style={wrapperStyle}>
                    {saleInfoComponent}
                    <DeckSynergiesInfoView synergies={deck.deckSynergyInfo} width={saleInfo && saleInfo.length !== 0 ? 840 : 1192}/>
                </div>
            </div>
        )
    }
}
