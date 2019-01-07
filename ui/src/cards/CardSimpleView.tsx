import { Divider } from "@material-ui/core"
import Popover from "@material-ui/core/Popover/Popover"
import Typography from "@material-ui/core/Typography/Typography"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { SynTraitType } from "../synergy/SynTraitType"
import { TraitBubble } from "../synergy/TraitBubble"
import { KCard } from "./KCard"
import { MaverickIcon, rarityValues } from "./rarity/Rarity"

export const CardSimpleView = (props: { card: Partial<KCard>, size?: number }) => {
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
    const {rating, expectedAmber, amberControl, creatureControl, artifactControl, traits, synergies} = extraCardInfo
    return (
        <div style={{backgroundColor: "#DFDFDF", display: "flex", width: 600, minHeight: 420, margin: spacing(1), borderRadius: "20px"}}>
            <div>
                <img src={props.card.frontImage}/>
            </div>
            <div style={{margin: spacing(2), width: "100%"}}>
                <Typography variant={"h6"}>{cardTitle}</Typography>
                <div style={{display: "flex"}}>
                    <Typography variant={"subtitle1"}>{cardType}</Typography>
                    <div style={{flexGrow: 1}}/>
                    {amber > 0 ? <Typography variant={"subtitle1"}>{amber} aember</Typography> : null}
                </div>
                <Typography>{cardText}</Typography>
                <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                <Typography>Rating: {rating - 1}</Typography>
                <Typography>Expected Aember: {expectedAmber}</Typography>
                <Typography>Aember Control: {amberControl}</Typography>
                <Typography>Creature Control: {creatureControl}</Typography>
                <Typography>Artifact Control: {artifactControl}</Typography>
                {traits.length !== 0 ? <Typography variant={"subtitle1"}>Traits</Typography> : null}
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {traits.map(trait => (
                        <TraitBubble key={trait} name={trait} positive={true} trait={true}/>
                    ))}
                </div>
                {synergies.length !== 0 ? <Typography variant={"subtitle1"}>Synergies</Typography> : null}
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {synergies.map(synergy => (
                        <TraitBubble key={synergy.id} name={synergy.trait} positive={synergy.rating > 0} home={synergy.type === SynTraitType.house}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

@observer
export class CardAsLine extends React.Component<{ card: Partial<KCard> }> {

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
        return (
            <div
                onWheel={this.handlePopoverClose}
            >
                <div
                    style={{display: "flex", marginTop: 4, width: 160}}
                    onMouseEnter={this.handlePopoverOpen}
                    onMouseLeave={this.handlePopoverClose}
                >
                    {rarityValues.get(card.rarity!)!.icon!}
                    <Typography
                        variant={"body2"}
                        style={{marginLeft: spacing(1)}}
                        noWrap={true}
                    >
                        {card.cardTitle}
                    </Typography>
                    {card.maverick ? <div style={{marginLeft: spacing(1)}}><MaverickIcon/></div> : null}
                </div>
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
                    <CardSimpleView card={card}/>
                </Popover>
            </div>
        )
    }
}
