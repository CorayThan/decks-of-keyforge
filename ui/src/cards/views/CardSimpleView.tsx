import { Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCard } from "../../aerc/views/AercForCard"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { ExpansionIcon } from "../../expansions/ExpansionIcon"
import { SimpleCard } from "../../generated-src/SimpleCard"
import { GraySidebar } from "../../generic/GraySidebar"
import { CardQualityIcon } from "../../generic/icons/CardQualityIcon"
import { UnstyledLink } from "../../generic/UnstyledLink"
import { HouseBanner } from "../../houses/HouseBanner"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { SynergyCombo } from "../../synergy/DeckSynergyInfo"
import { SynTraitValue } from "../../synergy/SynTraitValue"
import { TraitBubble } from "../../synergy/TraitBubble"
import { screenStore } from "../../ui/ScreenStore"
import { userStore } from "../../user/UserStore"
import { cardStore } from "../CardStore"
import { CardWinsDisplay } from "../cardwins/CardWinsDisplay"
import { CardUtils, findCardImageUrl, KCard } from "../KCard"

interface CardSimpleViewProps {
    card: SimpleCard
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

interface CardViewProps {
    card: KCard
    simple?: boolean
    noLink?: boolean
    combo?: SynergyCombo
    displayHistory?: boolean
}

export const CardView = observer((props: CardViewProps) => {
    const {card, simple, noLink, combo, displayHistory} = props
    if (simple) {
        return <CardSimpleView card={card}/>
    }
    const {cardTitle, cardType, cardText, amber} = card

    const extraCardInfo = cardStore.findExtraInfoToUse(card)

    const cardAerc = cardStore.hasAercFromCardName(card.cardTitle)!

    let previousCard
    if (displayHistory) {
        previousCard = cardStore.findPrevExtraInfoForCard(card.cardTitle)
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
                {card.houses.length > 1 && (
                    <HouseBanner houses={card.houses} size={24} style={{marginBottom: spacing(2), marginTop: spacing(1)}}/>
                )}
                <div style={{display: "flex"}}>
                    <Typography color={"textPrimary"} variant={"subtitle2"}>{cardType}</Typography>
                    <div style={{flexGrow: 1}}/>
                    {amber > 0 ? <Typography color={"textPrimary"} variant={"subtitle2"}>{amber} aember</Typography> : null}
                </div>
                <Typography color={"textPrimary"} variant={"body2"}>{cardText}</Typography>
                <CardWinsDisplay card={card}/>
                <AercAndSynergies card={card} combo={combo} title={previousCard && "Current AERC"}/>
                {previousCard && (
                    <AercAndSynergies card={previousCard} title={"Previous AERC"}/>
                )}
                {userStore.isAdmin && (
                    <>
                        <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                        <LinkButton
                            href={Routes.editExtraCardInfo(extraCardInfo.id)}
                            newWindow={true}
                        >
                            Edit
                        </LinkButton>
                    </>
                )}
            </div>
        </GraySidebar>
    )
})

export const CardSetsFromCard = (props: { card: KCard, noDot?: boolean }) => {
    const sets = props.card.cardNumbers?.map(cardNumber => cardNumber.expansion)
    return (
        <div style={{display: "flex"}}>
            {sets?.map((backendExpansion) => (
                <ExpansionIcon size={16} expansion={backendExpansion} key={backendExpansion} style={{marginLeft: spacing(1)}}/>
            ))}
        </div>
    )
}

export const CardTraits = (props: { traits: SynTraitValue[] }) => (
    <div style={{display: "flex", flexWrap: "wrap"}}>
        {props.traits.map(synergy => (
            <TraitBubble
                key={synergy.id}
                traitValue={synergy}
                trait={true}
            />
        ))}
    </div>
)

export const CardSynergies = (props: { synergies: SynTraitValue[] }) => (
    <div style={{display: "flex", flexWrap: "wrap"}}>
        {props.synergies.map(synergy => (
            <TraitBubble
                key={synergy.id}
                traitValue={synergy}
            />
        ))}
    </div>
)

const AercAndSynergies = (props: { card: KCard, combo?: SynergyCombo, title?: string }) => {
    const {card, combo, title} = props
    const extraCardInfo = card.extraCardInfo
    const {traits, synergies, publishedDate} = extraCardInfo
    return (
        <>
            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
            <div style={{display: "flex", alignItems: "flex-end"}}>
                <Typography color={"textPrimary"} variant={"h5"} style={{marginRight: spacing(2)}}>{title}</Typography>
                {title && publishedDate && (
                    <Typography color={"textPrimary"} variant={"subtitle2"}>{Utils.formatDate(publishedDate)}</Typography>
                )}
            </div>
            <AercForCard card={card} realValue={combo}/>
            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
            {traits.length !== 0 ? <Typography color={"textPrimary"} variant={"subtitle1"}>Traits</Typography> : null}
            <CardTraits traits={traits}/>
            {synergies.length !== 0 ? <Typography color={"textPrimary"} variant={"subtitle1"}>Synergies</Typography> : null}
            <CardSynergies synergies={synergies}/>
        </>
    )
}
