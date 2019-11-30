import Typography from "@material-ui/core/Typography/Typography"
import * as History from "history"
import { isEqual } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { RouteComponentProps } from "react-router-dom"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { Spoiler } from "../spoilers/Spoiler"
import { SpoilerView } from "../spoilers/SpoilerView"
import { uiStore } from "../ui/UiStore"
import { CardFilters } from "./CardFilters"
import { CardView } from "./CardSimpleView"
import { CardsSearchDrawer } from "./CardsSearchDrawer"
import { cardStore } from "./CardStore"
import { CardTableView } from "./CardTableView"
import { KCard } from "./KCard"

export class CardSearchPage extends React.Component<RouteComponentProps<{}>> {

    makeFilters = (props: Readonly<RouteComponentProps<{}>>): CardFilters => {
        const queryValues = QueryString.parse(props.location.search)
        return CardFilters.rehydrateFromQuery(queryValues)
    }

    render() {
        const filters = this.makeFilters(this.props)
        return <WaitForAllCards filters={filters} history={this.props.history}/>
    }
}

interface WaitForAllCardsProps {
    filters: CardFilters
    history: History.History
}

@observer
class WaitForAllCards extends React.Component<WaitForAllCardsProps> {

    render() {
        if (cardStore.allCards.length === 0) {
            return <Loader/>
        }
        return <LoadInitialCardSearch {...this.props}/>
    }
}


@observer
class LoadInitialCardSearch extends React.Component<WaitForAllCardsProps> {

    componentDidMount(): void {
        this.search()
    }

    componentDidUpdate(prevProps: WaitForAllCardsProps): void {
        if (!isEqual(this.props.filters, prevProps.filters)) {
            this.search()
        }
    }

    componentWillUnmount(): void {
        cardStore.reset()
    }

    search = () => {
        log.debug("Search card search page")
        cardStore.searchCards(this.props.filters)
    }

    render() {
        const cards = cardStore.cards
        if (cards == null) {
            return <Loader/>
        }
        return <CardSearchContainer {...this.props} cards={cards}/>
    }
}

interface CardSearchContainerProps extends WaitForAllCardsProps {
    cards: KCard[]
}

@observer
class CardSearchContainer extends React.Component<CardSearchContainerProps> {

    constructor(props: CardSearchContainerProps) {
        super(props)
        uiStore.setTopbarValues("Cards of KeyForge", "Cards", "Search and sort")
    }

    render() {
        const {cards, filters} = this.props

        let cardsDisplay
        if (cards.length === 0) {
            cardsDisplay = (
                <Typography variant={"h6"} color={"secondary"} style={{marginTop: spacing(4)}}>
                    Sorry, no cards match your search criteria.
                </Typography>
            )
        } else if (keyLocalStorage.cardListViewType === "table") {
            cardsDisplay = (
                <CardTableView cards={cards}/>
            )
        } else {
            cardsDisplay = (
                <CardsContainerWithScroll allCards={cards} showAllCards={keyLocalStorage.showAllCards} showHistory={filters.aercHistory}/>
            )
        }

        return (
            <div style={{display: "flex"}}>
                <CardsSearchDrawer history={this.props.history} filters={this.props.filters}/>
                <div
                    style={{flexGrow: 1, margin: spacing(2)}}
                >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        {cardsDisplay}
                    </div>
                </div>
            </div>
        )
    }
}

interface CardsContainerWithScrollProps {
    allCards?: KCard[]
    allSpoilers?: Spoiler[]
    showAllCards: boolean
    showHistory?: boolean
}

@observer
export class CardsContainerWithScroll extends React.Component<CardsContainerWithScrollProps> {

    @observable
    cardsToDisplay: KCard[] = []

    @observable
    spoilersToDisplay: Spoiler[] = []

    pageQuantity = 0

    loadMoreRef = React.createRef<HTMLDivElement>()

    constructor(props: CardsContainerWithScrollProps) {
        super(props)
        log.debug(`constructor All cards length: ${props.allCards!.length}`)
        this.resetCardsToDisplay(props)
    }

    componentDidMount(): void {
        window.addEventListener("scroll", this.handleScroll)
    }

    componentWillUnmount(): void {
        window.removeEventListener("scroll", this.handleScroll)
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<CardsContainerWithScrollProps>) {
        log.debug(`receive props All cards length: ${nextProps.allCards!.length}`)
        this.resetCardsToDisplay(nextProps)
    }

    resetCardsToDisplay = (props: CardsContainerWithScrollProps) => {
        log.debug("Reset cards to display.")
        this.pageQuantity = 1
        if (props.allCards == null) {
            if (props.allSpoilers!.length < 101 || props.showAllCards) {
                this.spoilersToDisplay = props.allSpoilers!.slice()
            } else {
                this.spoilersToDisplay = props.allSpoilers!.slice(0, 40 * this.pageQuantity)
            }
        } else {
            log.debug(`All cards length: ${props.allCards.length}`)
            if (props.allCards.length < 101 || props.showAllCards) {
                this.cardsToDisplay = props.allCards.slice()
            } else {
                this.cardsToDisplay = props.allCards.slice(0, 40 * this.pageQuantity)
            }
        }
    }

    updateCardsToDisplay = (props: CardsContainerWithScrollProps) => {
        this.pageQuantity++
        if (props.allCards == null) {
            this.spoilersToDisplay = props.allSpoilers!.slice(0, 40 * this.pageQuantity)
        } else {
            this.cardsToDisplay = props.allCards.slice(0, 40 * this.pageQuantity)
        }
    }

    handleScroll = () => {
        const offset = 10
        if (this.loadMoreRef.current == null) {
            return
        }
        const top = this.loadMoreRef.current!.getBoundingClientRect().top
        const inView = (top + offset) >= 0 && (top - offset) <= window.innerHeight
        if (inView) {
            this.updateCardsToDisplay(this.props)
        }
    }

    render() {
        const {allCards, allSpoilers, showHistory} = this.props
        const allCardsLength = allCards == null ? allSpoilers!.length : allCards.length
        const cardsDisplayedLength = allCards == null ? this.spoilersToDisplay.length : this.cardsToDisplay.length
        return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}} onScroll={this.handleScroll}>
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                    {allCards == null ? (
                        <>
                            {this.spoilersToDisplay.map(spoiler => (
                                <SpoilerView spoiler={spoiler} key={spoiler.id}/>
                            ))}
                        </>
                    ) : (
                        <>
                            {this.cardsToDisplay.map(card => (
                                <CardView
                                    card={card}
                                    key={card.id}
                                    simple={keyLocalStorage.cardListViewType === "image"}
                                    displayHistory={showHistory}
                                />
                            ))}
                        </>
                    )}
                </div>
                {cardsDisplayedLength !== allCardsLength ? (
                    <div ref={this.loadMoreRef}>
                        <Loader/>
                    </div>
                ) : null}
            </div>
        )
    }
}
