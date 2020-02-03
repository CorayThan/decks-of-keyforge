import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip } from "@material-ui/core"
import Popover from "@material-ui/core/Popover/Popover"
import Typography from "@material-ui/core/Typography/Typography"
import { round } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCard } from "../aerc/AercViews"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { Deck } from "../decks/Deck"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { BackendExpansion, expansionInfoMap } from "../expansions/Expansions"
import { GraySidebar } from "../generic/GraySidebar"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { UnstyledLink } from "../generic/UnstyledLink"
import { House } from "../houses/House"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { SynergyCombo } from "../synergy/DeckSynergyInfo"
import { TraitBubble } from "../synergy/TraitBubble"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { cardStore } from "./CardStore"
import { CardUtils, findCardImageUrl, hasAercFromCard, KCard } from "./KCard"
import { AnomalyIcon, LegacyIcon, MaverickIcon, rarityValues } from "./rarity/Rarity"

export interface HasFrontImage {
    cardTitle: string
    expansion?: number
    frontImage?: string
}

interface CardSimpleViewProps {
    card: HasFrontImage
    size?: number
    style?: React.CSSProperties
    noLink?: boolean
}

export const CardSimpleView = (props: CardSimpleViewProps) => {
    if (props.card == null) {
        return null
    }
    const width = props.size ? props.size : 300
    const contents = (
        <img
            alt={props.card.cardTitle}
            src={findCardImageUrl(props.card)}
            style={{width, height: (width * 420) / 300, margin: spacing(2), ...props.style}}
        />
    )
    if (props.noLink) {
        return contents
    }
    return (
        <UnstyledLink
            to={Routes.cardPage(props.card.cardTitle)}
        >
            {contents}
        </UnstyledLink>
    )
}

export const CardView = observer((props: { card: KCard, simple?: boolean, noLink?: boolean, combo?: SynergyCombo, displayHistory?: boolean }) => {
    const {card, simple, noLink, combo, displayHistory} = props
    if (simple) {
        return <CardSimpleView card={card}/>
    }
    const {cardTitle, cardType, cardText, amber, extraCardInfo} = card
    const cardAerc = hasAercFromCard(card)

    let previousCard
    const previousExtraInfo = cardStore.previousExtraInfo
    if (displayHistory && previousExtraInfo != null) {
        previousCard = previousExtraInfo[card.cardTitle]
    }

    const sidebarProps = screenStore.screenSizeXs() ? {
        vertical: true,
        width: 300,
    } : {
        width: 624,
    }

    return (
        <GraySidebar {...sidebarProps} >
            <div>
                <img alt={card.cardTitle} src={findCardImageUrl(card)}/>
            </div>
            <div style={{padding: spacing(2), width: "100%"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <CardQualityIcon quality={CardUtils.fakeRatingFromAerc(cardAerc)}/>
                    {noLink ? (
                        <Typography color={"textPrimary"} variant={"h6"} style={{marginLeft: spacing(1), flexGrow: 1}}>{cardTitle}</Typography>
                    ) : (
                        <UnstyledLink
                            to={Routes.cardPage(card.cardTitle)}
                            style={{marginLeft: spacing(1), flexGrow: 1, color: "rgba(0, 0, 0, 0.87)"}}
                        >
                            <Typography color={"textPrimary"} variant={"h6"}>{cardTitle}</Typography>
                        </UnstyledLink>
                    )}
                    <div style={{flexGrow: 1}}/>
                    <CardSetsFromCard card={card}/>
                </div>
                <div style={{display: "flex"}}>
                    <Typography color={"textPrimary"} variant={"subtitle2"}>{cardType}</Typography>
                    <div style={{flexGrow: 1}}/>
                    {amber > 0 ? <Typography color={"textPrimary"} variant={"subtitle2"}>{amber} aember</Typography> : null}
                </div>
                <Typography color={"textPrimary"}>{cardText}</Typography>
                {card.winRate != null ? (
                    <>
                        <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                        <div style={{display: "flex", justifyContent: "space-evenly", marginTop: spacing(1)}}>
                            <Tooltip
                                title={"This win rate is affected by house win rate, so expect cards in better houses to have higher win rates."}
                            >
                                <Typography color={"textPrimary"} variant={"body2"} noWrap={true} style={{fontStyle: "italic"}}>
                                    {round(card.winRate * 100, 1)}% win rate
                                </Typography>
                            </Tooltip>
                            <Tooltip
                                title={"Wins / Losses"}
                            >
                                <Typography color={"textPrimary"} variant={"body2"} style={{marginLeft: spacing(1)}}>{card.wins} / {card.losses}</Typography>
                            </Tooltip>
                        </div>
                    </>
                ) : null}
                <AercAndSynergies card={card} combo={combo} title={previousCard && "Current AERC"}/>
                {previousCard && (
                    <AercAndSynergies card={previousCard} title={"Previous AERC"}/>
                )}
                {userStore.isAdmin && (
                    <>
                        <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                        <LinkButton
                            to={Routes.editExtraCardInfo(extraCardInfo.id)}
                        >
                            Edit
                        </LinkButton>
                    </>
                )}
            </div>
        </GraySidebar>
    )
})

interface CardAsLineProps {
    card: Partial<KCard>
    deckExpansion?: BackendExpansion
    cardExpansions?: BackendExpansion[]
    width?: number
    marginTop?: number
    hideRarity?: boolean
    deck?: Deck
}

@observer
export class CardAsLine extends React.Component<CardAsLineProps> {

    render() {
        const complex = screenStore.screenSizeMdPlus()

        if (complex) {
            return <CardAsLineComplex {...this.props}/>
        } else {
            return <CardAsLineSimple  {...this.props}/>
        }
    }
}

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
        const fullCard = cardStore.fullCardFromCardWithName(card)

        if (card == null) {
            return null
        }

        let pop = null
        if (fullCard && fullCard.id != null) {
            pop = (
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
            )
        }

        // log.debug(`card name: ${this.props.card.cardTitle} Deck expansion = ${this.props.deckExpansion} card expansion = ${this.props.card.expansion}`)

        let expansions
        if (fullCard != null && fullCard.extraCardInfo != null) {
            expansions = fullCard.extraCardInfo.cardNumbers.map(cardNumbers => cardNumbers.expansion)
        }

        return (
            <div
                onWheel={this.handlePopoverClose}
                onClick={() => this.popOpen = true}
                onMouseEnter={this.handlePopoverOpen}
                onMouseLeave={this.handlePopoverClose}
            >
                <CardLine  {...this.props} card={this.props.card} cardExpansions={expansions}/>
                {pop}
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

const CardLine = (props: CardAsLineProps) => {

    const isAnomaly = props.card.anomaly
    const isLegacy = !isAnomaly && props.deckExpansion != null && props.cardExpansions != null && !props.cardExpansions.includes(props.deckExpansion)
    const isMaverick = props.card.maverick && !isAnomaly

    return (
        <div
            style={{display: "flex", alignItems: "center", marginTop: props.marginTop, width: props.width}}
        >
            {!props.hideRarity && props.card.rarity ? rarityValues.get(props.card.rarity)!.icon! : null}
            <Typography
                variant={"body2"}
                style={{marginLeft: spacing(1)}}
                noWrap={true}
            >
                {props.card.cardTitle}
            </Typography>
            {isMaverick ? <div style={{marginLeft: spacing(1)}}><MaverickIcon/></div> : null}
            {isLegacy ? <div style={{marginLeft: spacing(1)}}><LegacyIcon/></div> : null}
            {isAnomaly ? <div style={{marginLeft: spacing(1)}}><AnomalyIcon/></div> : null}
        </div>
    )
}

export const CardSetsFromCard = (props: { card: KCard, noDot?: boolean }) => {
    const sets = props.card.extraCardInfo.cardNumbers.map(cardNumber => expansionInfoMap.get(cardNumber.expansion)!.backendEnum)
    return (
        <div style={{display: "flex"}}>
            {sets.map((backendExpansion) => (
                <ExpansionIcon size={16} expansion={backendExpansion} key={backendExpansion} style={{marginLeft: spacing(1)}}/>
            ))}
        </div>
    )
}

export const CardTraits = (props: { card: KCard }) => (
    <div style={{display: "flex", flexWrap: "wrap"}}>
        {props.card.extraCardInfo.traits.map(synergy => (
            <TraitBubble
                key={synergy.id}
                name={synergy.trait}
                positive={synergy.rating > 0}
                synTraitType={synergy.type}
                rating={synergy.rating}
                trait={true}
            />
        ))}
    </div>
)

export const CardSynergies = (props: { card: KCard }) => (
    <div style={{display: "flex", flexWrap: "wrap"}}>
        {props.card.extraCardInfo.synergies.map(synergy => (
            <TraitBubble
                key={synergy.id}
                name={synergy.trait}
                positive={synergy.rating > 0}
                synTraitType={synergy.type}
                rating={synergy.rating}
                cardName={synergy.cardName}
            />
        ))}
    </div>
)

const AercAndSynergies = (props: { card: KCard, combo?: SynergyCombo, title?: string }) => {
    const {card, combo, title} = props
    const {extraCardInfo} = card
    const {traits, synergies, published} = extraCardInfo
    return (
        <>
            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
            <div style={{display: "flex", alignItems: "flex-end"}}>
                <Typography color={"textPrimary"} variant={"h5"} style={{marginRight: spacing(2)}}>{title}</Typography>
                {title && published && (
                    <Typography color={"textPrimary"} variant={"subtitle2"}>{Utils.epochSecondsToDate(published)}</Typography>
                )}
            </div>
            <AercForCard card={card} realValue={combo}/>
            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
            {traits.length !== 0 ? <Typography color={"textPrimary"} variant={"subtitle1"}>Traits</Typography> : null}
            <CardTraits card={card}/>
            {synergies.length !== 0 ? <Typography color={"textPrimary"} variant={"subtitle1"}>Synergies</Typography> : null}
            <CardSynergies card={card}/>
        </>
    )
}
