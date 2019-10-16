import Typography from "@material-ui/core/Typography/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { Spoiler } from "../spoilers/Spoiler"
import { SpoilerView } from "../spoilers/SpoilerView"
import { uiStore } from "../ui/UiStore"
import { CardView } from "./CardSimpleView"
import { CardsSearchDrawer } from "./CardsSearchDrawer"
import { cardStore } from "./CardStore"
import { CardTableView } from "./CardTableView"
import { KCard } from "./KCard"

@observer
export class CardsPage extends React.Component {

    constructor(props: {}) {
        super(props)
        uiStore.setTopbarValues("Cards of KeyForge", "Cards", "Search and sort")
    }

    render() {

        const {cards, searchingForCards} = cardStore

        let cardsDisplay
        if (!searchingForCards && cards) {
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
                    <CardsContainerWithScroll allCards={cards} showAllCards={keyLocalStorage.showAllCards}/>
                )
            }
        }

        return (
            <div style={{display: "flex"}}>
                <CardsSearchDrawer/>
                <div
                    style={{flexGrow: 1, margin: spacing(2)}}
                >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Loader show={searchingForCards}/>
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
        this.resetCardsToDisplay(props)
    }

    componentDidMount(): void {
        window.addEventListener("scroll", this.handleScroll)
    }

    componentWillUnmount(): void {
        window.removeEventListener("scroll", this.handleScroll)
    }

    componentWillReceiveProps(nextProps: Readonly<CardsContainerWithScrollProps>) {
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
        const allCards = this.props.allCards
        const allSpoilers = this.props.allSpoilers
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
                                    displayHistory={keyLocalStorage.genericStorage.historicalAerc}
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
