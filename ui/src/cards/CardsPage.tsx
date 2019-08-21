import Typography from "@material-ui/core/Typography/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"
import { CardView } from "./CardSimpleView"
import { CardsSearchDrawer } from "./CardsSearchDrawer"
import { cardStore } from "./CardStore"
import { KCard } from "./KCard"

@observer
export class CardsPage extends React.Component {

    constructor(props: {}) {
        super(props)
        uiStore.setTopbarValues("Cards of Keyforge", "Cards", "Search and sort")
    }

    handleScroll = () => {
        log.debug("Scrolling in cards page. outer")
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
            } else {
                cardsDisplay = (
                    <CardsContainerWithScroll allCards={cards} showAllCards={keyLocalStorage.showAllCards}/>
                )
            }
        }

        return (
            <div style={{display: "flex"}} onScroll={this.handleScroll}>
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
    allCards: KCard[]
    showAllCards: boolean
}

@observer
class CardsContainerWithScroll extends React.Component<CardsContainerWithScrollProps> {

    @observable
    cardsToDisplay: KCard[] = []

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
        if (props.allCards.length < 101 || props.showAllCards) {
            this.cardsToDisplay = props.allCards.slice()
        } else {
            this.cardsToDisplay = props.allCards.slice(0, 40 * this.pageQuantity)
        }
    }

    updateCardsToDisplay = (props: CardsContainerWithScrollProps) => {
        this.pageQuantity++
        this.cardsToDisplay = props.allCards.slice(0, 40 * this.pageQuantity)
        log.debug("Updating cards to display with page quantity " + this.pageQuantity)
    }

    handleScroll = () => {
        log.debug("Scrolling in cards page.")
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
        return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}} onScroll={this.handleScroll}>
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                    {this.cardsToDisplay.map(card => (
                        <CardView card={card} key={card.id} simple={!keyLocalStorage.showFullCardView}/>
                    ))}
                </div>
                {this.cardsToDisplay.length !== allCards.length ? (
                    <div ref={this.loadMoreRef}>
                        <Loader/>
                    </div>
                ) : null}
            </div>
        )
    }
}
