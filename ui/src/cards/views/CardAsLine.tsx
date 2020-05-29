import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"
import Popover from "@material-ui/core/Popover/Popover"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCard } from "../../aerc/views/AercForCard"
import { spacing, useGlobalStyles } from "../../config/MuiConfig"
import { Deck } from "../../decks/Deck"
import { BackendExpansion } from "../../expansions/Expansions"
import { House } from "../../houses/House"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { screenStore } from "../../ui/ScreenStore"
import { cardStore } from "../CardStore"
import { KCard } from "../KCard"
import { AnomalyIcon, LegacyIcon, MaverickIcon, RarityIcon } from "../rarity/Rarity"
import { CardSimpleView, CardView, HasFrontImage } from "./CardSimpleView"

interface CardAsLineProps {
    card: Partial<KCard>
    cardActualHouse: House
    deckExpansion?: BackendExpansion
    width?: number
    marginTop?: number
    hideRarity?: boolean
    deck?: Deck
}

export const CardAsLine = observer((props: CardAsLineProps) => {

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
        const card = this.props.card
        const fullCard = cardStore.fullCardFromCardWithName(card)

        if (card == null) {
            return null
        }

        let dialog = null
        if (fullCard && fullCard.id != null) {
            dialog = (
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                    style={{zIndex: screenStore.zindexes.cardsDisplay}}
                >
                    <DialogTitle disableTypography={true} style={{display: "flex", justifyContent: "center"}}>
                        <Typography variant={"h5"}>{card.cardTitle}</Typography>
                    </DialogTitle>
                    <DialogContent style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                        <CardSimpleView card={card as HasFrontImage} size={250} style={{margin: 4}}/>
                        <div style={{marginTop: spacing(2)}}>
                            <AercForCard card={fullCard as KCard} realValue={findSynegyComboForCardFromDeck(fullCard, card.house, this.props.deck)}/>
                        </div>
                    </DialogContent>
                    <DialogActions style={{display: "flex", justifyContent: "center"}}>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Close</KeyButton>
                    </DialogActions>
                </Dialog>
            )
        }
        return (
            <div>
                <div onClick={this.handleOpen}>
                    <CardLine {...this.props} card={fullCard == null ? this.props.card : fullCard}/>
                </div>
                {dialog}
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
        const card = this.props.card

        if (!cardStore.cardsLoaded) {
            return null
        }

        const fullCard = cardStore.fullCardFromCardWithName(card)

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
                    <CardView card={fullCard as KCard} combo={findSynegyComboForCardFromDeck(fullCard, card.house, this.props.deck)}/>
                </Popover>
            </div>
        )
    }
}

const findSynegyComboForCardFromDeck = (card: Partial<KCard>, house?: House, deck?: Deck) => {
    const name = card.cardTitle
    if (name == null || deck == null || deck.synergies == null) {
        return
    }
    return deck.synergies.synergyCombos.find(combo => combo.cardName === name && (house == null || combo.house === house))
}

const useStyles = makeStyles({
    root: (props: CardAsLineProps) => ({display: "flex", alignItems: "center", marginTop: props.marginTop, width: props.width})
})

const CardLine = observer((props: CardAsLineProps) => {
    const classes = useStyles(props)
    const globalClasses = useGlobalStyles()
    const {card, deckExpansion, hideRarity, cardActualHouse} = props

    const fullCard = cardStore.fullCardFromCardWithName(card)
    if (fullCard == null) return null

    let cardExpansions
    if (fullCard.extraCardInfo != null) {
        cardExpansions = fullCard.extraCardInfo.cardNumbers.map(cardNumbers => cardNumbers.expansion)
    }

    const isAnomaly = fullCard.anomaly
    const isLegacy = !isAnomaly && deckExpansion != null && cardExpansions != null && !cardExpansions.includes(deckExpansion)
    const isMaverick = fullCard.house !== cardActualHouse && !isAnomaly

    return (
        <div className={classes.root}>
            {!hideRarity && fullCard.rarity ? <RarityIcon rarity={fullCard.rarity}/> : null}
            <Typography
                variant={"body2"}
                style={{marginLeft: spacing(1)}}
                noWrap={true}
            >
                {fullCard.cardTitle}
            </Typography>
            {isMaverick ? <div className={globalClasses.marginLeftSmall}><MaverickIcon/></div> : null}
            {isLegacy ? <div className={globalClasses.marginLeftSmall}><LegacyIcon/></div> : null}
            {isAnomaly ? <div className={globalClasses.marginLeftSmall}><AnomalyIcon/></div> : null}
        </div>
    )
})
