import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip } from "@material-ui/core"
import Popover from "@material-ui/core/Popover/Popover"
import Typography from "@material-ui/core/Typography/Typography"
import { round } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { expansionInfoMap } from "../expansions/Expansions"
import { GraySidebar } from "../generic/GraySidebar"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { KeyButton } from "../mui-restyled/KeyButton"
import { AercScoreView } from "../stats/AercScoreView"
import { SynTraitType } from "../synergy/SynTraitType"
import { TraitBubble } from "../synergy/TraitBubble"
import { screenStore } from "../ui/ScreenStore"
import { cardStore } from "./CardStore"
import { hasAercFromCard, KCard } from "./KCard"
import { LegacyIcon, MaverickIcon, rarityValues } from "./rarity/Rarity"

interface HasFrontImage {
    frontImage: string
}

interface CardSimpleViewProps {
    card: HasFrontImage
    size?: number
    style?: React.CSSProperties
}

export const CardSimpleView = (props: CardSimpleViewProps) => {
    if (props.card == null) {
        return null
    }
    return (
        <div>
            <img alt={"card"} src={props.card.frontImage} style={{width: props.size ? props.size : 300, margin: spacing(2), ...props.style}}/>
        </div>
    )
}

export const CardView = (props: { card: KCard, simple?: boolean }) => {
    const card = props.card
    if (props.simple) {
        return <CardSimpleView card={card}/>
    }
    const {cardTitle, cardType, cardText, amber, extraCardInfo} = card
    const {rating, traits, synergies} = extraCardInfo

    const sidebarProps = screenStore.screenSizeXs() ? {
        vertical: true,
        width: 300,
    } : {
        width: 600,
    }

    const cardAerc = hasAercFromCard(card)

    return (
        <GraySidebar {...sidebarProps} >
            <div>
                <img alt={card.cardTitle} src={card.frontImage}/>
            </div>
            <div style={{padding: spacing(2), width: "100%"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <CardQualityIcon quality={rating}/>
                    <Typography variant={"h6"} style={{marginLeft: spacing(1), flexGrow: 1}}>{cardTitle}</Typography>
                    {card.extraCardInfo.cardNumbers.map((cardNumber, idx) => (
                        <div style={{display: "flex", alignItems: "center"}} key={idx}>
                            {idx !== 0 ? (
                                <div style={{
                                    height: 4,
                                    width: 4,
                                    borderRadius: "50%",
                                    backgroundColor: "#555",
                                    marginLeft: spacing(1),
                                    marginRight: spacing(1)
                                }}/>
                            ) : null}

                            <Typography>{expansionInfoMap.get(cardNumber.expansion)!.abbreviation}</Typography>
                        </div>
                    ))}
                </div>
                <div style={{display: "flex"}}>
                    <Typography variant={"subtitle1"}>{cardType}</Typography>
                    <div style={{flexGrow: 1}}/>
                    {amber > 0 ? <Typography variant={"subtitle1"}>{amber} aember</Typography> : null}
                </div>
                <Typography>{cardText}</Typography>
                <AercScoreView hasAerc={cardAerc} style={{marginTop: spacing(1)}} dark={true} narrow={true}/>
                {card.winRate != null ? (
                    <div style={{display: "flex", justifyContent: "space-evenly", marginTop: spacing(1)}}>
                        <Tooltip
                            title={"This win rate is affected by house win rate, so expect cards in better houses to have higher win rates."}
                        >
                            <Typography noWrap={true} style={{fontStyle: "italic"}}>{round(card.winRate * 100, 1)}% win rate</Typography>
                        </Tooltip>
                        <Typography style={{marginLeft: spacing(1), marginRight: spacing(1)}}>{card.wins} wins</Typography>
                        <Typography>{card.losses} losses</Typography>
                    </div>
                ) : null}
                <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                {traits.length !== 0 ? <Typography variant={"subtitle1"}>Traits</Typography> : null}
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {traits.map(trait => (
                        <TraitBubble key={trait} name={trait} positive={true} trait={true}/>
                    ))}
                </div>
                {synergies.length !== 0 ? <Typography variant={"subtitle1"}>Synergies</Typography> : null}
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {synergies.map(synergy => (
                        <TraitBubble
                            key={synergy.id}
                            name={synergy.trait}
                            positive={synergy.rating > 0}
                            home={synergy.type === SynTraitType.house}
                            noHome={synergy.type === SynTraitType.outOfHouse}
                            rating={synergy.rating}
                        />
                    ))}
                </div>
            </div>
        </GraySidebar>
    )
}

interface CardAsLineProps {
    card: Partial<KCard>
    deckExpansion?: number
    cardExpansions?: number[]
    width?: number
    marginTop?: number
    hideRarity?: boolean
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
            const cardAerc = hasAercFromCard(fullCard as KCard)
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
                        <AercScoreView hasAerc={cardAerc} style={{marginTop: spacing(2)}} dark={true} narrow={true}/>
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
                    <CardLine {...this.props}/>
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
                    <CardView card={fullCard as KCard}/>
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
                <CardLine  {...this.props} cardExpansions={expansions}/>
                {pop}
            </div>
        )
    }
}

const CardLine = (props: CardAsLineProps) => {

    const isLegacy = props.deckExpansion != null && props.cardExpansions != null && !props.cardExpansions.includes(props.deckExpansion)

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
            {props.card.maverick ? <div style={{marginLeft: spacing(1)}}><MaverickIcon/></div> : null}
            {isLegacy ? <div style={{marginLeft: spacing(1)}}><LegacyIcon/></div> : null}
        </div>
    )
}
