import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import Popover from "@material-ui/core/Popover/Popover"
import Typography from "@material-ui/core/Typography/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCard } from "../../aerc/views/AercForCard"
import { spacing } from "../../config/MuiConfig"
import { DeckSearchResult } from "../../decks/models/DeckSearchResult"
import { SimpleCard } from "../../decks/models/HouseAndCards"
import { BackendExpansion } from "../../expansions/Expansions"
import { House } from "../../houses/House"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { screenStore } from "../../ui/ScreenStore"
import { cardStore } from "../CardStore"
import { KCard } from "../KCard"
import { AnomalyIcon, LegacyIcon, MaverickIcon, RarityIcon } from "../rarity/Rarity"
import { CardSimpleView, CardView } from "./CardSimpleView"

interface CardAsLineProps {
    card: SimpleCard
    cardActualHouse: House
    deckExpansion?: BackendExpansion
    width?: number
    marginTop?: number
    hideRarity?: boolean
    deck?: DeckSearchResult
}

export const CardAsLine = observer((props: CardAsLineProps) => {

    if (!cardStore.cardsLoaded) {
        return null
    }

    const complex = screenStore.screenSizeMdPlus()

    if (complex) {
        return <CardAsLineComplex {...props}/>
    } else {
        return <CardAsLineSimple  {...props}/>
    }
})

@observer
class CardAsLineSimple extends React.Component<CardAsLineProps> {
    @observable
    open = false

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
    }

    render() {
        const {card, cardActualHouse} = this.props

        const fullCard = cardStore.fullCardFromCardName(card.cardTitle)

        if (fullCard == null) {
            return <Typography>No card {card.cardTitle}</Typography>
        }

        return (
            <div>
                <div onClick={this.handleOpen}>
                    <CardLine {...this.props} card={card}/>
                </div>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                    style={{zIndex: screenStore.zindexes.cardsDisplay}}
                >
                    <DialogTitle disableTypography={true} style={{display: "flex", justifyContent: "center"}}>
                        <Typography variant={"h5"}>{card.cardTitle}</Typography>
                    </DialogTitle>
                    <DialogContent style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                        <CardSimpleView card={card} size={250} style={{margin: 4}}/>
                        <div style={{marginTop: spacing(2)}}>
                            <AercForCard card={fullCard as KCard} realValue={findSynegyComboForCardFromDeck(fullCard, cardActualHouse, this.props.deck)}/>
                        </div>
                    </DialogContent>
                    <DialogActions style={{display: "flex", justifyContent: "center"}}>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Close</KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

@observer
class CardAsLineComplex extends React.Component<CardAsLineProps> {

    @observable
    popOpen = false
    anchorElement?: HTMLDivElement

    handlePopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        this.anchorElement = event.currentTarget
        this.popOpen = true
    }

    handlePopoverClose = () => {
        this.anchorElement = undefined
        this.popOpen = false
    }

    render() {
        const {card, cardActualHouse} = this.props

        if (!cardStore.cardsLoaded) {
            return null
        }

        const fullCard = cardStore.fullCardFromCardName(card.cardTitle)

        if (fullCard == null) {
            return <Typography>Can't find card {card.cardTitle}</Typography>
        }

        return (
            <div
                onWheel={this.handlePopoverClose}
                onClick={() => this.popOpen = true}
                onMouseEnter={this.handlePopoverOpen}
                onMouseLeave={this.handlePopoverClose}
            >
                <CardLine  {...this.props} card={this.props.card}/>
                <Popover
                    style={{pointerEvents: "none"}}
                    open={this.popOpen}
                    anchorEl={this.anchorElement}
                    onClose={this.handlePopoverClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    disableAutoFocus={true}
                    disableRestoreFocus={true}
                >
                    <CardView card={fullCard} combo={findSynegyComboForCardFromDeck(fullCard, cardActualHouse, this.props.deck)}/>
                </Popover>
            </div>
        )
    }
}

const findSynegyComboForCardFromDeck = (card: Partial<KCard>, house?: House, deck?: DeckSearchResult) => {
    const name = card.cardTitle
    if (name == null || deck == null || deck.synergies == null) {
        return
    }
    return deck.synergies.synergyCombos.find(combo => combo.cardName === name && (house == null || combo.house === house))
}

const CardLine = observer((props: CardAsLineProps) => {
    const {card, deckExpansion, hideRarity, cardActualHouse} = props

    const fullCard = cardStore.fullCardFromCardName(card.cardTitle)
    if (fullCard == null) return <Typography>No card {card.cardTitle}</Typography>

    let cardExpansions
    if (fullCard.extraCardInfo != null) {
        cardExpansions = fullCard.extraCardInfo.cardNumbers.map(cardNumbers => cardNumbers.expansion)
    }

    const isAnomaly = fullCard.anomaly
    const isLegacy = !isAnomaly && deckExpansion != null && cardExpansions != null && !cardExpansions.includes(deckExpansion)
    const isMaverick = fullCard.house !== cardActualHouse && !isAnomaly

    return (
        <div
            style={{display: "flex", alignItems: "center", marginTop: props.marginTop, width: props.width}}
        >
            {!hideRarity && fullCard.rarity ? <RarityIcon rarity={fullCard.rarity}/> : null}
            <Typography
                variant={"body2"}
                style={{marginLeft: spacing(1), color: card.enhanced ? blue.A200 : undefined}}
                noWrap={true}
            >
                {fullCard.cardTitle}
            </Typography>
            {isMaverick ? <div style={{marginLeft: spacing(1)}}><MaverickIcon/></div> : null}
            {isLegacy ? <div style={{marginLeft: spacing(1)}}><LegacyIcon/></div> : null}
            {isAnomaly ? <div style={{marginLeft: spacing(1)}}><AnomalyIcon/></div> : null}
        </div>
    )
})