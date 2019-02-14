import { Divider } from "@material-ui/core"
import Popover from "@material-ui/core/Popover/Popover"
import Typography from "@material-ui/core/Typography/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { TraitsView } from "../stats/TraitsView"
import { SynTraitType } from "../synergy/SynTraitType"
import { TraitBubble } from "../synergy/TraitBubble"
import { ScreenStore } from "../ui/ScreenStore"
import { CardStore } from "./CardStore"
import { KCard } from "./KCard"
import { MaverickIcon, rarityValues } from "./rarity/Rarity"

interface HasFrontImage {
    frontImage: string
}

interface CardSimpleViewProps {
    card: HasFrontImage
    size?: number
}

export const CardSimpleView = (props: CardSimpleViewProps) => {
    return (
        <div>
            <img src={props.card.frontImage} style={{width: props.size ? props.size : 300, margin: spacing(2)}}/>
        </div>
    )
}

export const CardView = (props: { card: KCard, simple?: boolean }) => {
    if (props.simple) {
        return <CardSimpleView card={props.card}/>
    }
    const {cardTitle, cardType, cardText, amber, extraCardInfo} = props.card
    const {rating, traits, synergies} = extraCardInfo

    const wrapperStyle: React.CSSProperties = ScreenStore.instance.screenSizeXs() ? {
        backgroundColor: "#DFDFDF",
        display: "flex",
        flexDirection: "column",
        width: 300,
        margin: spacing(1),
        borderRadius: "20px"
    } : {
        backgroundColor: "#DFDFDF",
        display: "flex",
        width: 600,
        minHeight: 420,
        margin: spacing(1),
        borderRadius: "20px"
    }

    return (
        <div style={wrapperStyle}>
            <div>
                <img src={props.card.frontImage}/>
            </div>
            <div style={{padding: spacing(2), width: "100%"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <CardQualityIcon quality={rating}/>
                    <Typography variant={"h6"} style={{marginLeft: spacing(1)}}>{cardTitle}</Typography>
                </div>
                <div style={{display: "flex"}}>
                    <Typography variant={"subtitle1"}>{cardType}</Typography>
                    <div style={{flexGrow: 1}}/>
                    {amber > 0 ? <Typography variant={"subtitle1"}>{amber} aember</Typography> : null}
                </div>
                <Typography>{cardText}</Typography>
                <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                <TraitsView hasTraits={extraCardInfo} color={"rgba(0, 0, 0, 0.87)"}/>
                <Divider style={{marginTop: spacing(2), marginBottom: spacing(1)}}/>
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
                            rating={synergy.rating}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

interface CardAsLineProps {
    card: Partial<KCard>
}

@observer
export class CardAsLine extends React.Component<CardAsLineProps> {

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
        const fullCard = CardStore.instance.fullCardFromCardWithName(card)
        const complex = !ScreenStore.instance.screenSizeXs()

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
                    {complex ? <CardView card={fullCard as KCard}/> : <CardSimpleView card={fullCard as KCard}/>}
                </Popover>
            )
        }

        return (
            <div
                onWheel={this.handlePopoverClose}
                onClick={() => this.popOpen = true}
            >
                <div
                    style={{display: "flex", marginTop: 4, width: 160}}
                    onMouseEnter={this.handlePopoverOpen}
                    onMouseLeave={this.handlePopoverClose}
                >
                    {card.rarity ? rarityValues.get(card.rarity)!.icon! : null}
                    <Typography
                        variant={"body2"}
                        style={{marginLeft: spacing(1)}}
                        noWrap={true}
                    >
                        {card.cardTitle}
                    </Typography>
                    {card.maverick ? <div style={{marginLeft: spacing(1)}}><MaverickIcon/></div> : null}
                </div>
                {pop}
            </div>
        )
    }
}
