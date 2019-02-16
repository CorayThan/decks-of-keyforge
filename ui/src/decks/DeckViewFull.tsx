import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { DeckStatsView, ExtraDeckStatsView } from "../stats/DeckStatsView"
import { DeckSynergiesInfoView } from "../synergy/DeckSynergiesInfoView"
import { screenStore } from "../ui/ScreenStore"
import { UiStore } from "../ui/UiStore"
import { DeckWithSynergyInfo } from "./Deck"
import { deckImportPopStore } from "./DeckImportPop"
import { DeckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"
import { SaleInfoView } from "./sales/SaleInfoView"

interface DeckViewPageProps extends RouteComponentProps<{ keyforgeDeckId: string }> {
}

export class DeckViewPage extends React.Component<DeckViewPageProps> {
    render() {
        const deckId = this.props.match.params.keyforgeDeckId
        log.debug(`Rendering deck view page with deck id: ${deckId}`)
        return (<DeckViewFullContainer keyforgeDeckId={deckId}/>)
    }
}

interface DeckViewFullProps {
    keyforgeDeckId: string
}

@observer
class DeckViewFullContainer extends React.Component<DeckViewFullProps> {

    constructor(props: DeckViewFullProps) {
        super(props)
        DeckStore.instance.deck = undefined
        DeckStore.instance.saleInfo = undefined
        UiStore.instance.setTopbarValues("Deck", "Deck", "")
    }

    componentDidMount(): void {
        this.refreshDeck(this.props.keyforgeDeckId)
    }

    componentWillReceiveProps(nextProps: Readonly<DeckViewFullProps>) {
        this.refreshDeck(nextProps.keyforgeDeckId)
    }

    refreshDeck = (deckId: string) => {
        DeckStore.instance.findDeck(deckId)
        DeckStore.instance.findDeckSaleInfo(deckId)
        DeckStore.instance.importedDeck = undefined
        deckImportPopStore.popOpen = false
        if (DeckStore.instance.deck) {
            const deck = DeckStore.instance.deck
            UiStore.instance.setTopbarValues("Deck " + deck.deck.name, deck.deck.name, "")
        }
    }

    render() {
        log.debug("Rendering DeckViewFull")
        const {deck} = DeckStore.instance
        if (!deck) {
            return <Loader/>
        }
        return <DeckViewFullView deck={deck}/>
    }
}

@observer
class DeckViewFullView extends React.Component<{ deck: DeckWithSynergyInfo }> {

    constructor(props: { deck: DeckWithSynergyInfo }) {
        super(props)
        const deck = props.deck.deck
        UiStore.instance.setTopbarValues(deck.name, deck.name, "")
    }

    render() {
        const deck = this.props.deck
        const {saleInfo} = DeckStore.instance
        let saleInfoComponent = null
        if (saleInfo) {
            saleInfoComponent = <SaleInfoView saleInfo={saleInfo} deckName={deck.deck.name} keyforgeId={deck.deck.keyforgeId}/>
        } else {
            saleInfoComponent = <Loader/>
        }

        let inner

        if (screenStore.screenSizeMd()) {
            inner = (
                <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                    <DeckViewSmall deck={deck.deck} fullVersion={true}/>
                    <DeckStatsView deck={deck.deck}/>
                    {saleInfoComponent}
                    <DeckSynergiesInfoView
                        synergies={deck}
                        width={undefined}
                    />
                    <div style={{display: "flex", flexWrap: "wrap"}}>
                        <ExtraDeckStatsView deck={deck.deck}/>
                    </div>
                </div>
            )
        } else {
            const wrapperStyle: React.CSSProperties = {display: "flex", flexWrap: "wrap"}
            inner = (
                <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                    <div style={{display: "flex", flexWrap: "wrap"}}>
                        <ExtraDeckStatsView deck={deck.deck}/>
                    </div>
                    <div style={wrapperStyle}>
                        <DeckViewSmall deck={deck.deck} fullVersion={true}/>
                        <DeckStatsView deck={deck.deck}/>
                    </div>
                    <div style={wrapperStyle}>
                        {saleInfoComponent}
                        <DeckSynergiesInfoView
                            synergies={deck}
                            width={(saleInfo && saleInfo.length !== 0 ? 840 : 1200)}
                        />
                    </div>
                </div>
            )
        }

        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                {inner}
            </div>
        )

    }
}
