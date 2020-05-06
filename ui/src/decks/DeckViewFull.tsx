import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { DeckStatsView, ExtraDeckStatsView } from "../stats/DeckStatsView"
import { DeckSynergiesInfoView } from "../synergy/DeckSynergiesInfoView"
import { uiStore } from "../ui/UiStore"
import { DeckWithSynergyInfo } from "./Deck"
import { deckImportPopStore } from "./DeckImportPop"
import { deckStore } from "./DeckStore"
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
        deckStore.deck = undefined
        deckStore.saleInfo = undefined
        uiStore.setTopbarValues("Deck", "Deck", "")
    }

    componentDidMount(): void {
        log.debug(`Refresh deck in component did mount.`)
        this.refreshDeck()
    }

    componentDidUpdate(prevProps: DeckViewFullProps) {
        if (this.props.keyforgeDeckId != prevProps.keyforgeDeckId) {
            log.debug(`Component did update refresh deck because this id is ${this.props.keyforgeDeckId} and prev is ${prevProps.keyforgeDeckId}`)
            this.refreshDeck()
        }
    }

    componentWillUnmount(): void {
        deckStore.deck = undefined
    }

    refreshDeck = () => {
        const deckId = this.props.keyforgeDeckId
        deckStore.randomDeckId = undefined
        deckStore.findDeck(deckId)
        deckStore.findDeckSaleInfo(deckId)
        deckStore.importedDeck = undefined
        deckImportPopStore.popOpen = false
    }

    render() {
        log.debug("Rendering DeckViewFull")
        const {deck} = deckStore
        if (!deck) {
            return <Loader/>
        }
        return <DeckViewFullView deck={deck}/>
    }
}

interface DeckViewFullViewProps {
    deck: DeckWithSynergyInfo
    fake?: boolean
}

@observer
export class DeckViewFullView extends React.Component<DeckViewFullViewProps> {

    constructor(props: DeckViewFullViewProps) {
        super(props)
        const deck = props.deck.deck
        uiStore.setTopbarValues("Deck", "Deck", "")
        uiStore.setDocTitleAndDescription(deck.name)
    }

    componentDidMount(): void {
        this.setTopBarValues()
    }

    componentDidUpdate() {
        log.debug("Component did update set top bar values")
        this.setTopBarValues()
    }

    setTopBarValues = () => uiStore.setTopbarValues(this.props.deck.deck.name, "Deck", "")

    render() {
        const {deck, fake} = this.props

        const {saleInfo} = deckStore
        let saleInfoComponent = null
        if (saleInfo) {
            saleInfoComponent = <SaleInfoView saleInfo={saleInfo} deckName={deck.deck.name} keyforgeId={deck.deck.keyforgeId} deckId={deck.deck.id}/>
        } else if (!fake) {
            saleInfoComponent = <Loader/>
        }


        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <ExtraDeckStatsView deck={deck.deck}/>
                <DeckViewSmall deck={deck.deck} fullVersion={true} hideActions={fake}/>
                <DeckStatsView deck={deck.deck}/>
                {saleInfoComponent}
                <DeckSynergiesInfoView
                    synergies={deck}
                />
            </div>
        )

    }
}
